/**
 * Deterministic Resume Parsing System
 * Uses regex-based pattern matching and structured segmenters to extract resume fields.
 * Includes a dynamic confidence scoring engine.
 */

import {
  EMAIL_REGEX,
  PHONE_REGEX,
  LINKEDIN_REGEX,
  GITHUB_REGEX
} from '../utils/parserPatterns.js';

import {
  normalizeWhitespace,
  cleanSectionText,
  extractSections,
  deduplicateByKey,
  safeArray
} from '../utils/parserHelpers.js';

/**
 * Helper to split project line into clean Name and Tech Stack
 */
function parseProjectLine(line) {
  let name = line;
  let techStack = '';
  let githubLink = '';
  let liveLink = '';

  // Extract markdown links like [Source Code](URL) or [Live Demo](URL)
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const mdMatches = [...line.matchAll(mdLinkRegex)];
  
  for (const m of mdMatches) {
    const anchor = m[1].toLowerCase();
    const url = m[2];
    if (anchor.includes('code') || anchor.includes('source') || anchor.includes('github')) {
      githubLink = url;
    } else if (anchor.includes('demo') || anchor.includes('live') || anchor.includes('deploy')) {
      liveLink = url;
    }
  }

  // Strip markdown links from the line before parsing name/techStack
  name = line.replace(mdLinkRegex, '').trim();

  // 1. If it contains a pipe, dash, or long spaces, split there
  const separators = ['|', '—', ' - ', '  '];
  for (const sep of separators) {
    if (name.includes(sep)) {
      const parts = name.split(sep);
      name = parts[0].trim();
      techStack = parts.slice(1).join(' ').trim();
      break;
    }
  }

  // 2. If it contains common tech terms, split there
  const commonTech = ['React', 'Django', 'FastAPI', 'HTML', 'CSS', 'JavaScript', 'Firebase', 'SQLite', 'JWT', 'Docker', 'Python', 'Node'];
  
  let firstTechIndex = -1;
  for (const tech of commonTech) {
    const idx = name.indexOf(tech);
    if (idx !== -1 && (firstTechIndex === -1 || idx < firstTechIndex)) {
      firstTechIndex = idx;
    }
  }

  if (firstTechIndex !== -1 && firstTechIndex > 3) {
    const possibleName = name.substring(0, firstTechIndex).trim();
    const possibleTech = name.substring(firstTechIndex).trim();
    
    // Only split if name is reasonably short and clean
    if (possibleName && possibleName.split(/\s+/).length < 8) {
      name = possibleName;
      techStack = possibleTech;
    }
  }

  // Strip links like "Source Code", "Live Demo"
  name = name.replace(/\b(Source Code|Live Demo|Github Link|Demo)\b/ig, '').trim();
  name = name.replace(/^[•\-\*\s|]+/, '').replace(/[•\-\*\s|]+$/, '').trim();

  techStack = techStack.replace(/\b(Source Code|Live Demo|Github Link|Demo)\b/ig, '').trim();
  techStack = techStack.replace(/^[•\-\*\s|]+/, '').replace(/[•\-\*\s|]+$/, '').trim();

  return { name, techStack, githubLink, liveLink };
}

/**
 * Helper to parse experience role line and extract clean role name and date
 */
function parseExperienceLine(line) {
  let role = line;
  let date = '';

  // Extract dates like "2025 - Present" or "2023 - 2024" or "May 2024"
  const dateMatch = line.match(/\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}\s*[-–—]\s*(?:Present|\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(?:19|20)\d{2}\b)/i) || 
                    line.match(/\b(19|20)\d{2}\b/);
  
  if (dateMatch) {
    date = dateMatch[0].trim();
    role = line.replace(date, '').trim();
  }

  // Clean role line separators
  role = role.replace(/^[•\-\*\s|]+/, '').replace(/[•\-\*\s|]+$/, '').trim();

  return { role, date };
}

/**
 * Helper to split course name and issuing authority by dashes, colons, or markdown links
 */
function parseCertificationLine(line) {
  let name = line;
  let issuer = 'Credential Provider';

  // 1. Strip markdown brackets or links first if present
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const mdMatches = [...line.matchAll(mdLinkRegex)];
  
  if (mdMatches.length > 0) {
    // If it has markdown links, extract the first one as name
    name = line.replace(mdLinkRegex, '$1').trim();
  }

  // 2. Separators: dash – or - or colon :
  const separators = ['–', ' - ', ' -', '- ', '-', ':'];
  for (const sep of separators) {
    if (name.includes(sep)) {
      const parts = name.split(sep);
      issuer = parts[0].trim();
      name = parts.slice(1).join(' ').trim();
      break;
    }
  }

  // Strip link anchors or bracket delimiters
  name = name.replace(/[\[\]]/g, '').trim();
  issuer = issuer.replace(/[\[\]]/g, '').trim();

  return { name, issuer };
}

/**
 * Parses raw text extracted from PDF or DOCX and maps it to structured resume fields.
 * @param {string} rawText - The raw extracted text from the document.
 * @returns {object} Structured parsing result with parsedData and metadata
 */
export function parseResumeText(rawText) {
  const result = {
    parsedData: {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
      },
      summary: '',
      education: [],
      experience: [],
      projects: [],
      skills: [],
      certifications: []
    },
    metadata: {
      detectedSections: [],
      confidence: {
        personalInfo: 0,
        summary: 0,
        education: 0,
        experience: 0,
        projects: 0,
        skills: 0,
        certifications: 0
      }
    }
  };

  if (!rawText) return result;

  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // ─── 1. Personal Info Extraction ───
  // Email
  const emailMatch = rawText.match(EMAIL_REGEX);
  if (emailMatch) {
    result.parsedData.personalInfo.email = emailMatch[0].toLowerCase().trim();
  }

  // Phone
  const phoneMatch = rawText.match(PHONE_REGEX);
  if (phoneMatch) {
    result.parsedData.personalInfo.phone = phoneMatch[0].trim();
  }

  // LinkedIn
  const linkedinMatch = rawText.match(LINKEDIN_REGEX);
  if (linkedinMatch) {
    result.parsedData.personalInfo.linkedin = linkedinMatch[0].trim();
  }

  // GitHub
  const githubMatch = rawText.match(GITHUB_REGEX);
  if (githubMatch) {
    result.parsedData.personalInfo.github = githubMatch[0].trim();
  }

  // Name: typically the first non-empty line that doesn't contain links, email, phone, etc.
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (
      lower.includes('@') ||
      lower.includes('github.com') ||
      lower.includes('linkedin.com') ||
      PHONE_REGEX.test(line) ||
      lower.includes('resume') ||
      lower.includes('curriculum') ||
      lower.includes('page') ||
      line.split(/\s+/).length > 4
    ) {
      continue;
    }
    result.parsedData.personalInfo.name = line.trim();
    break;
  }

  // ─── 2. Segment Sections ───
  const sections = extractSections(lines);

  // ─── 3. Parse Summary ───
  if (sections.summary.length > 0) {
    result.parsedData.summary = sections.summary
      .map(line => cleanSectionText(line))
      .join(' ');
  }

  // ─── 4. Parse Education ───
  let currentEdu = null;
  for (const line of sections.education) {
    const cleanedLine = cleanSectionText(line);
    const yearMatch = cleanedLine.match(/\b(19|20)\d{2}\b/);
    const degreeMatch = cleanedLine.match(/\b(b\.?s\.?c?|b\.?tech|m\.?tech|bachelor|master|ph\.?d|associate|degree|high school|diploma)\b/i);

    if (degreeMatch) {
      if (currentEdu) {
        result.parsedData.education.push(currentEdu);
      }
      currentEdu = {
        degree: cleanedLine,
        institution: 'University / School',
        year: yearMatch ? yearMatch[0] : '',
        cgpa: ''
      };

      const instMatch = cleanedLine.match(/(?:at|from)\s+([A-Za-z0-9\s]+(?:University|College|School|Institute|Academy))/i);
      if (instMatch) {
        currentEdu.institution = instMatch[1].trim();
      }
    } else if (currentEdu) {
      const instMatch = cleanedLine.match(/\b([A-Za-z0-9\s]+(?:University|College|School|Institute|Academy))\b/i);
      if (instMatch) {
        currentEdu.institution = instMatch[0].trim();
      }
      if (yearMatch && !currentEdu.year) {
        currentEdu.year = yearMatch[0];
      }
      const gpaMatch = cleanedLine.match(/\b(cgpa|gpa|g\.p\.a\.)\s*(?:of)?\s*([0-9.]+)\b/i);
      if (gpaMatch) {
        currentEdu.cgpa = gpaMatch[2];
      }
    } else {
      currentEdu = {
        degree: cleanedLine,
        institution: 'University / School',
        year: yearMatch ? yearMatch[0] : '',
        cgpa: ''
      };
    }
  }
  if (currentEdu) {
    result.parsedData.education.push(currentEdu);
  }

  // ─── 5. Parse Experience ───
  let currentExp = null;
  for (const line of sections.experience) {
    const cleanedLine = cleanSectionText(line);
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
    const roleMatch = cleanedLine.match(/\b(engineer|developer|manager|intern|analyst|consultant|architect|specialist|lead|designer|volunteer|head|member|officer|coordinator|president|founder)\b/i);
    const dateMatch = cleanedLine.match(/\b(19|20)\d{2}\b/);

    const looksLikeRole = roleMatch && 
      !isBullet && 
      cleanedLine.split(/\s+/).length < 12 && 
      !cleanedLine.match(/^(coordinated|led|managed|built|developed|spearheaded|worked|assisted|supported|created)/i);

    if (looksLikeRole) {
      // Find company name lookback
      let company = 'Company Name';
      const idx = sections.experience.indexOf(line);
      if (idx > 0) {
        const prevLine = cleanSectionText(sections.experience[idx - 1]);
        const isPrevBullet = sections.experience[idx - 1].startsWith('•') || sections.experience[idx - 1].startsWith('-') || sections.experience[idx - 1].startsWith('*');
        const prevRoleMatch = prevLine.match(/\b(engineer|developer|manager|intern|analyst|consultant|architect|specialist|lead|designer|volunteer|head|member)\b/i);
        
        if (!isPrevBullet && !prevRoleMatch && prevLine.length < 80) {
          company = prevLine;
        }
      }

      if (currentExp) {
        result.parsedData.experience.push(currentExp);
      }

      const { role, date } = parseExperienceLine(cleanedLine);
      currentExp = {
        role: role || cleanedLine,
        company: company,
        startDate: date || (dateMatch ? dateMatch[0] : ''),
        endDate: '',
        description: ''
      };
    } else if (currentExp) {
      if (isBullet) {
        currentExp.description += (currentExp.description ? '\n' : '') + cleanedLine;
      } else {
        const compMatch = cleanedLine.match(/\b([A-Za-z0-9\s]+(?:Inc|LLC|Ltd|Corporation|Corp|Systems|Technologies|Google|Amazon|Microsoft|Facebook|Meta|Apple|Netflix|Uber|Lyft))\b/i);
        if (compMatch && currentExp.company === 'Company Name') {
          currentExp.company = compMatch[0].trim();
        } else if (dateMatch && !currentExp.startDate) {
          currentExp.startDate = dateMatch[0];
        } else {
          currentExp.description += (currentExp.description ? '\n' : '') + cleanedLine;
        }
      }
    } else {
      const { role, date } = parseExperienceLine(cleanedLine);
      currentExp = {
        role: role || cleanedLine,
        company: 'Company Name',
        startDate: date || (dateMatch ? dateMatch[0] : ''),
        endDate: '',
        description: ''
      };
    }
  }
  if (currentExp) {
    result.parsedData.experience.push(currentExp);
  }

  // ─── 6. Parse Projects ───
  let currentProj = null;
  for (const line of sections.projects) {
    const cleanedLine = cleanSectionText(line);
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');

    const startsWithUpper = /^[A-Z]/.test(cleanedLine);
    const hasProjKeywords = cleanedLine.includes('Source Code') || 
                            cleanedLine.includes('Live Demo') || 
                            cleanedLine.includes('Github') || 
                            cleanedLine.includes('|');

    const looksLikeProjTitle = !isBullet && 
      startsWithUpper &&
      cleanedLine.split(/\s+/).length < 25 && 
      hasProjKeywords &&
      !cleanedLine.match(/^(coordinated|led|managed|built|developed|spearheaded|worked|assisted|supported|created|designed|implemented)/i);

    if (looksLikeProjTitle) {
      if (currentProj) {
        result.parsedData.projects.push(currentProj);
      }
      const { name, techStack, githubLink, liveLink } = parseProjectLine(cleanedLine);
      currentProj = {
        name: name || cleanedLine,
        description: '',
        techStack: techStack || '',
        githubLink: githubLink || '',
        liveLink: liveLink || ''
      };
    } else if (currentProj) {
      currentProj.description += (currentProj.description ? '\n' : '') + cleanedLine;
    } else {
      const { name, techStack, githubLink, liveLink } = parseProjectLine(cleanedLine);
      currentProj = {
        name: name || cleanedLine,
        description: '',
        techStack: techStack || '',
        githubLink: githubLink || '',
        liveLink: liveLink || ''
      };
    }
  }
  if (currentProj) {
    result.parsedData.projects.push(currentProj);
  }

  // ─── 7. Parse Skills ───
  const matchedSkills = [];
  const commonTech = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
    'html', 'css', 'react', 'next.js', 'vue', 'angular', 'svelte', 'express', 'node.js', 'django', 'flask',
    'fastapi', 'spring boot', 'laravel', 'rails', 'nest.js', 'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis',
    'prisma', 'sequelize', 'graphql', 'rest api', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'github',
    'ci/cd', 'tailwind', 'bootstrap', 'sass', 'redux', 'zustand', 'webpack', 'vite', 'jest', 'testing', 'cypress'
  ];

  for (const line of sections.skills) {
    const cleanedLine = cleanSectionText(line);
    if (cleanedLine.includes(',')) {
      cleanedLine.split(',').forEach(s => {
        const item = s.trim();
        if (item && item.length < 30) matchedSkills.push(item);
      });
    } else if (cleanedLine.includes('|')) {
      cleanedLine.split('|').forEach(s => {
        const item = s.trim();
        if (item && item.length < 30) matchedSkills.push(item);
      });
    } else if (cleanedLine.length < 25 && !line.startsWith('•') && !line.startsWith('-')) {
      matchedSkills.push(cleanedLine);
    } else {
      const words = cleanedLine.toLowerCase().split(/[\s,:/|•\-*]+/);
      commonTech.forEach(tech => {
        if (cleanedLine.toLowerCase().includes(tech)) {
          const capitalizedTech = tech.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('.');
          matchedSkills.push(capitalizedTech);
        }
      });
    }
  }
  result.parsedData.skills = matchedSkills.filter(s => s.length > 1);

  // ─── 8. Parse Certifications ───
  let currentCert = null;
  for (const line of sections.certifications) {
    const cleanedLine = cleanSectionText(line);
    const yearMatch = cleanedLine.match(/\b(19|20)\d{2}\b/);

    if (cleanedLine.split(/\s+/).length < 15) {
      if (currentCert) {
        result.parsedData.certifications.push(currentCert);
      }
      const { name, issuer } = parseCertificationLine(cleanedLine);
      currentCert = {
        name: name || cleanedLine,
        issuer: issuer && issuer !== 'Credential Provider' ? issuer : 'Credential Provider',
        year: yearMatch ? yearMatch[0] : ''
      };

      const issuerMatch = cleanedLine.match(/(?:by|from|at)\s+([A-Za-z0-9\s]+)/i);
      if (issuerMatch && currentCert.issuer === 'Credential Provider') {
        currentCert.issuer = issuerMatch[1].trim();
      }
    } else if (currentCert) {
      if (yearMatch && !currentCert.year) {
        currentCert.year = yearMatch[0];
      }
      const issuerMatch = cleanedLine.match(/\b([A-Za-z0-9\s]+(?:AWS|Microsoft|Google|Cisco|IBM|Coursera|Udemy|Oracle))\b/i);
      if (issuerMatch && currentCert.issuer === 'Credential Provider') {
        currentCert.issuer = issuerMatch[0].trim();
      }
    } else {
      const { name, issuer } = parseCertificationLine(cleanedLine);
      currentCert = {
        name: name || cleanedLine,
        issuer: issuer && issuer !== 'Credential Provider' ? issuer : 'Credential Provider',
        year: yearMatch ? yearMatch[0] : ''
      };
    }
  }
  if (currentCert) {
    result.parsedData.certifications.push(currentCert);
  }

  // ─── 9. Deduplicate Parsed Arrays (Prevent duplicate records) ───
  result.parsedData.skills = Array.from(new Set(result.parsedData.skills));
  result.parsedData.education = deduplicateByKey(safeArray(result.parsedData.education), 'degree');
  result.parsedData.experience = deduplicateByKey(safeArray(result.parsedData.experience), 'role');
  result.parsedData.projects = deduplicateByKey(safeArray(result.parsedData.projects), 'name');
  result.parsedData.certifications = deduplicateByKey(safeArray(result.parsedData.certifications), 'name');

  // ─── 10. Dynamic Confidence & Detected Section Mapping ───
  const confidence = result.metadata.confidence;
  const detectedSections = result.metadata.detectedSections;

  // Personal Info Completeness
  const pi = result.parsedData.personalInfo;
  let piMatches = 0;
  const piKeys = ['name', 'email', 'phone', 'linkedin', 'github'];
  piKeys.forEach(k => { if (pi[k]) piMatches++; });
  confidence.personalInfo = piMatches / piKeys.length;
  if (piMatches > 0) detectedSections.push('personalInfo');

  // Summary
  if (result.parsedData.summary) {
    confidence.summary = 1.0;
    detectedSections.push('summary');
  }

  // Education Completeness
  if (result.parsedData.education.length > 0) {
    let edFields = 0;
    result.parsedData.education.forEach(ed => {
      if (ed.degree && ed.degree !== 'Degree') edFields++;
      if (ed.institution && ed.institution !== 'University / School') edFields++;
      if (ed.year) edFields++;
    });
    confidence.education = edFields / (result.parsedData.education.length * 3);
    detectedSections.push('education');
  }

  // Experience Completeness
  if (result.parsedData.experience.length > 0) {
    let exFields = 0;
    result.parsedData.experience.forEach(ex => {
      if (ex.role && ex.role !== 'Role') exFields++;
      if (ex.company && ex.company !== 'Company Name') exFields++;
      if (ex.description) exFields++;
    });
    confidence.experience = exFields / (result.parsedData.experience.length * 3);
    detectedSections.push('experience');
  }

  // Projects Completeness
  if (result.parsedData.projects.length > 0) {
    let prFields = 0;
    result.parsedData.projects.forEach(pr => {
      if (pr.name && pr.name !== 'Project Name') prFields++;
      if (pr.description) prFields++;
    });
    confidence.projects = prFields / (result.parsedData.projects.length * 2);
    detectedSections.push('projects');
  }

  // Skills Completeness
  if (result.parsedData.skills.length > 0) {
    confidence.skills = 1.0;
    detectedSections.push('skills');
  }

  // Certifications Completeness
  if (result.parsedData.certifications.length > 0) {
    let ceFields = 0;
    result.parsedData.certifications.forEach(ce => {
      if (ce.name && ce.name !== 'Certification') ceFields++;
      if (ce.issuer && ce.issuer !== 'Credential Provider') ceFields++;
    });
    confidence.certifications = ceFields / (result.parsedData.certifications.length * 2);
    detectedSections.push('certifications');
  }

  return result;
}
