/**
 * Smart ATS Analysis Service
 * - Handles domain-agnostic keyword extraction, normalization, and comparison.
 * - Computes ATS Score, Keyword Match %, Matched/Missing keywords, Strengths, and Suggestions.
 * - Provides Score Breakdown details and category labels.
 */

// ── Synonym Normalization Map ──
const SYNONYM_MAP = {
  "node": "node.js",
  "nodejs": "node.js",
  "rest": "rest api",
  "rest apis": "rest api",
  "reactjs": "react",
  "react.js": "react",
  "js": "javascript"
};

// ── Pretty Casing Map for Normalized Keywords ──
const PRETTY_NAMES = {
  "node.js": "Node.js",
  "rest api": "REST API",
  "react": "React",
  "javascript": "JavaScript",
  "aws": "AWS",
  "seo": "SEO",
  "sem": "SEM",
  "crm": "CRM",
  "pmp": "PMP",
  "csm": "CSM",
  "cfa": "CFA",
  "cpa": "CPA",
  "hris": "HRIS",
  "vlsi": "VLSI",
  "vhdl": "VHDL",
  "plc": "PLC",
  "fea": "FEA",
  "gis": "GIS",
  "hvac": "HVAC",
  "cpr": "CPR",
  "bls": "BLS",
  "emr": "EMR",
  "ehr": "EHR",
  "hipaa": "HIPAA",
  "html": "HTML",
  "css": "CSS",
  "sql": "SQL"
};

/**
 * Normalizes keyword according to synonym map
 * @param {string} kw - Raw keyword
 * @returns {string} Normalized lowercase keyword
 */
export function normalizeKeyword(kw) {
  if (!kw) return '';
  const lower = kw.toLowerCase().trim();
  return SYNONYM_MAP[lower] || lower;
}

/**
 * Returns pretty casing format for a normalized keyword
 * @param {string} normKw - Normalized lowercase keyword
 * @returns {string} Pretty cased name
 */
export function getPrettyName(normKw) {
  if (!normKw) return '';
  const lower = normKw.toLowerCase().trim();
  if (PRETTY_NAMES[lower]) return PRETTY_NAMES[lower];
  // Fallback: title case the keyword
  return normKw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ── Stop Words List ──
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here',
  'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in',
  'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor',
  'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre',
  'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well',
  'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom',
  'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself',
  'yourselves',
  // Generic job / resume terms
  'experience', 'duties', 'responsibilities', 'requirements', 'skills', 'job', 'candidate', 'role', 'work', 'team',
  'year', 'years', 'qualification', 'qualifications', 'company', 'description', 'ability', 'knowledge',
  'working', 'strong', 'excellent', 'successful', 'opportunity', 'position', 'apply', 'required', 'preferred', 'desired',
  'plus', 'highly', 'competent', 'expert', 'proficient', 'professional', 'proven', 'demonstrated', 'field', 'industry',
  'track', 'record', 'must', 'should', 'could', 'would', 'will', 'have'
]);

// ── Predefined Multi-Domain Keywords ──
const MULTI_DOMAIN_KEYWORDS = [
  // Technical / Software / ECE
  'react', 'angular', 'vue', 'node.js', 'nodejs', 'express', 'python', 'java', 'javascript', 'typescript', 'c++', 'c#',
  'ruby', 'php', 'swift', 'go', 'rust', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'git', 'ci/cd', 'html', 'css',
  'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'cassandra', 'oracle', 'firebase', 'graphql', 'rest api', 'restful',
  'microservices', 'devops', 'testing', 'unit testing', 'qa', 'scrum', 'agile', 'kanban', 'jira', 'trello', 'confluence',
  'jenkins', 'embedded systems', 'vlsi', 'circuit design', 'microcontrollers', 'arduino', 'raspberry pi',
  
  // Data Science / Analytics
  'data analysis', 'data science', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'artificial intelligence',
  'tableau', 'power bi', 'excel', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'statistics', 'a/b testing',
  'r programming', 'sas', 'data warehousing', 'spark', 'hadoop',

  // Marketing & Sales
  'digital marketing', 'seo', 'sem', 'google analytics', 'crm', 'salesforce', 'hubspot', 'email marketing', 'content creation',
  'brand strategy', 'lead generation', 'copywriting', 'social media', 'advertising', 'product marketing', 'sales growth',
  'account management', 'cold calling', 'negotiation', 'client relations', 'business development', 'market research',
  'campaign management', 'social media marketing',

  // MBA / Finance / Business
  'project management', 'product management', 'business analysis', 'strategy', 'consulting', 'financial analysis',
  'financial modeling', 'accounting', 'gaap', 'budgeting', 'forecasting', 'risk management', 'auditing', 'tax compliance',
  'corporate finance', 'mba', 'operations', 'logistics', 'supply chain', 'procurement', 'contract negotiation',

  // HR & Operations
  'recruiting', 'talent acquisition', 'employee relations', 'hris', 'payroll', 'onboarding', 'performance management',
  'training & development', 'workforce planning', 'conflict resolution', 'recruitment',

  // Healthcare
  'patient care', 'nursing', 'cpr', 'bls', 'hipaa', 'emr', 'ehr', 'clinical research', 'healthcare administration',
  'diagnostics', 'medical billing',

  // Design
  'figma', 'sketch', 'photoshop', 'illustrator', 'indesign', 'premiere pro', 'ui/ux design', 'graphic design', 'wireframing',
  'prototyping', 'interaction design', 'motion graphics', 'adobe creative suite',

  // Engineering (Mechanical, Civil)
  'autocad', 'solidworks', 'matlab', 'labview', 'revit', 'fea', 'finite element analysis', 'six sigma', 'lean manufacturing',
  'thermodynamics', 'fluid dynamics', 'structural analysis', 'hvac', 'construction management', 'gis', 'engineering design',

  // Teaching & Education
  'curriculum design', 'lesson planning', 'classroom management', 'tutoring', 'pedagogy', 'special education',
  'differentiated instruction', 'e-learning', 'stem', 'educational leadership',

  // Certifications
  'pmp', 'csm', 'capm', 'cfa', 'cpa', 'phr', 'sphr', 'shrm-cp', 'itil', 'leed', 'ccna', 'cissp', 'comptia'
];

/**
 * Checks if keyword matches within text, respecting boundaries and specialty symbols
 * @param {string} textLower - Lowercase search text
 * @param {string} keyword - Term to search for
 * @returns {boolean} Matches or not
 */
function matchKeyword(textLower, keyword) {
  const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const pattern = new RegExp(`(?:^|[^a-zA-Z0-9+#.-])${escaped}(?:$|[^a-zA-Z0-9+#.-])`, 'i');
  return pattern.test(textLower);
}

/**
 * Extracts normalized, unique keywords dynamically from any text block
 * @param {string} text - Raw input text
 * @returns {string[]} List of extracted keywords
 */
export function extractKeywords(text) {
  if (!text || typeof text !== 'string') return [];

  const foundKeywords = new Set();
  const textLower = text.toLowerCase();

  // 1. Dictionary Matching
  for (const kw of MULTI_DOMAIN_KEYWORDS) {
    if (matchKeyword(textLower, kw)) {
      foundKeywords.add(kw);
    }
  }

  // 2. Acronym Matching (2-5 uppercase chars)
  const acronymMatches = text.match(/\b[A-Z]{2,5}\b/g) || [];
  acronymMatches.forEach(ac => {
    const acLower = ac.toLowerCase();
    if (!STOP_WORDS.has(acLower)) {
      foundKeywords.add(ac);
    }
  });

  // 3. Capitalized Proper Noun sequences
  const sentences = text.split(/[.!?\n]+/);
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    let currentPhrase = [];
    for (let i = 0; i < words.length; i++) {
      // Clean word boundaries
      const cleanWord = words[i].replace(/^[^a-zA-Z0-9+#.-]+|[^a-zA-Z0-9+#.-]+$/g, '');
      const isCapitalized = /^[A-Z][a-zA-Z0-9+#.-]*/.test(cleanWord);
      const isStop = STOP_WORDS.has(cleanWord.toLowerCase());
      const isFirst = i === 0;

      if (isCapitalized && !isStop) {
        if (isFirst) {
          if (cleanWord.length > 3 || /[.+#-]/.test(cleanWord)) {
            currentPhrase.push(cleanWord);
          }
        } else {
          currentPhrase.push(cleanWord);
        }
      } else {
        if (currentPhrase.length > 0) {
          foundKeywords.add(currentPhrase.join(' '));
          currentPhrase = [];
        }
      }
    }
    if (currentPhrase.length > 0) {
      foundKeywords.add(currentPhrase.join(' '));
    }
  }

  // 4. Case-insensitive Deduplication with casing preference
  const finalKeywordsMap = new Map(); // lowercase -> original case
  foundKeywords.forEach(kw => {
    const kwTrimmed = kw.trim();
    if (!kwTrimmed || STOP_WORDS.has(kwTrimmed.toLowerCase())) return;
    
    if (kwTrimmed.length < 2 && !['r', 'go', 'c'].includes(kwTrimmed.toLowerCase())) return;

    const lower = kwTrimmed.toLowerCase();
    const existing = finalKeywordsMap.get(lower);
    if (!existing) {
      finalKeywordsMap.set(lower, kwTrimmed);
    } else {
      const isNewUpper = kwTrimmed === kwTrimmed.toUpperCase();
      const isNewCapitalized = /^[A-Z]/.test(kwTrimmed);
      const isExistUpper = existing === existing.toUpperCase();
      const isExistCapitalized = /^[A-Z]/.test(existing);

      if ((isNewUpper && !isExistUpper) || (isNewCapitalized && !isExistCapitalized)) {
        finalKeywordsMap.set(lower, kwTrimmed);
      }
    }
  });

  return Array.from(finalKeywordsMap.values());
}

/**
 * Core ATS Scoring and Analysis Engine
 * @param {object} resume - Complete Prisma resume query result
 * @param {string} jobDescription - Raw Job Description text
 * @returns {object} Analysis result details
 */
export async function analyzeResume(resume, jobDescription) {
  const resumeTextParts = [];
  if (resume.title) resumeTextParts.push(resume.title);
  if (resume.description) resumeTextParts.push(resume.description);
  
  if (resume.personalInfo) {
    if (resume.personalInfo.summary) resumeTextParts.push(resume.personalInfo.summary);
  }
  
  if (resume.skills && resume.skills.length > 0) {
    resumeTextParts.push(resume.skills.map(s => s.name).join(', '));
  }
  
  if (resume.experience && resume.experience.length > 0) {
    resume.experience.forEach(exp => {
      resumeTextParts.push(exp.role);
      resumeTextParts.push(exp.company);
      resumeTextParts.push(exp.description);
    });
  }
  
  if (resume.projects && resume.projects.length > 0) {
    resume.projects.forEach(proj => {
      resumeTextParts.push(proj.name);
      resumeTextParts.push(proj.techStack);
      resumeTextParts.push(proj.description);
    });
  }
  
  if (resume.education && resume.education.length > 0) {
    resume.education.forEach(edu => {
      resumeTextParts.push(edu.degree);
      resumeTextParts.push(edu.institution);
    });
  }
  
  if (resume.certifications && resume.certifications.length > 0) {
    resume.certifications.forEach(cert => {
      resumeTextParts.push(cert.name);
      resumeTextParts.push(cert.issuer);
    });
  }
  
  const resumeText = resumeTextParts.join('\n');

  // Extract raw keywords
  const rawJdKeywords = extractKeywords(jobDescription);
  const rawResumeKeywords = extractKeywords(resumeText);

  // Normalize keywords utilizing the Synonym Map
  const normalizedJdMap = new Map();     // normalized lower -> original extracted kw (for reference)
  const normalizedResumeSet = new Set();  // normalized lower

  rawJdKeywords.forEach(kw => {
    normalizedJdMap.set(normalizeKeyword(kw), kw);
  });

  rawResumeKeywords.forEach(kw => {
    normalizedResumeSet.add(normalizeKeyword(kw));
  });

  // Perform Normalized Comparisons
  const matchedNormalized = [];
  const missingNormalized = [];

  const textLower = resumeText.toLowerCase();

  normalizedJdMap.forEach((originalKw, normKw) => {
    let isMatched = normalizedResumeSet.has(normKw);

    // Fallback: search raw resume text directly using the normalized term or its synonyms
    if (!isMatched) {
      isMatched = matchKeyword(textLower, normKw);
      
      if (!isMatched) {
        // Check synonyms
        const synonyms = Object.keys(SYNONYM_MAP).filter(key => SYNONYM_MAP[key] === normKw);
        isMatched = synonyms.some(syn => matchKeyword(textLower, syn));
      }
    }

    if (isMatched) {
      matchedNormalized.push(normKw);
    } else {
      missingNormalized.push(normKw);
    }
  });

  // Re-casing matched/missing keywords back to Pretty Display Casing
  const matchedKeywords = matchedNormalized.map(k => getPrettyName(k));
  const missingKeywords = missingNormalized.map(k => getPrettyName(k));

  // Match Percent (Normalized)
  const jdKeywordsCount = normalizedJdMap.size;
  const keywordMatchPercent = jdKeywordsCount > 0
    ? Math.round((matchedNormalized.length / jdKeywordsCount) * 100)
    : 100;

  // 4. Calculate Score Breakdown
  // A. Keyword Coverage (50% max)
  const keywordCoverageScore = Math.round(keywordMatchPercent * 0.5);

  // B. Profile Completeness (10% max)
  let profileCompletenessScore = 0;
  if (resume.personalInfo) {
    const pi = resume.personalInfo;
    if (pi.name && pi.name.trim()) profileCompletenessScore += 2;
    if (pi.email && pi.email.trim()) profileCompletenessScore += 2;
    if (pi.phone && pi.phone.trim()) profileCompletenessScore += 2;
    if (pi.location && pi.location.trim()) profileCompletenessScore += 2;
    if ((pi.linkedin && pi.linkedin.trim()) || (pi.github && pi.github.trim()) || (pi.portfolio && pi.portfolio.trim())) {
      profileCompletenessScore += 2;
    }
  }

  // C. Education Presence (10% max)
  const educationScore = (resume.education && resume.education.length > 0) ? 10 : 0;

  // D. Experience Relevance (15% max)
  let experienceScore = 0;
  if (resume.experience && resume.experience.length > 0) {
    experienceScore += 5; // Base presence
    const expText = resume.experience.map(e => `${e.role} ${e.company} ${e.description}`).join(' ').toLowerCase();
    const hasJdKeywordInExp = Array.from(normalizedJdMap.keys()).some(kw => expText.includes(kw));
    if (hasJdKeywordInExp) {
      experienceScore += 10;
    }
  }

  // E. Project Relevance (10% max)
  let projectsScore = 0;
  if (resume.projects && resume.projects.length > 0) {
    projectsScore += 5; // Base presence
    const projText = resume.projects.map(p => `${p.name} ${p.techStack} ${p.description}`).join(' ').toLowerCase();
    const hasJdKeywordInProj = Array.from(normalizedJdMap.keys()).some(kw => projText.includes(kw));
    if (hasJdKeywordInProj) {
      projectsScore += 5;
    }
  }

  // F. Certification Relevance (5% max)
  let certificationsScore = 0;
  if (resume.certifications && resume.certifications.length > 0) {
    certificationsScore += 3; // Base presence
    const certText = resume.certifications.map(c => `${c.name} ${c.issuer}`).join(' ').toLowerCase();
    const hasJdKeywordInCert = Array.from(normalizedJdMap.keys()).some(kw => certText.includes(kw));
    if (hasJdKeywordInCert) {
      certificationsScore += 2;
    }
  }

  // Total calculated ATS Score
  const totalScore = keywordCoverageScore + profileCompletenessScore + educationScore + experienceScore + projectsScore + certificationsScore;
  const finalScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  // ATS Category Score Labels
  let scoreLabel = 'Needs Improvement';
  if (finalScore >= 90) scoreLabel = 'Excellent';
  else if (finalScore >= 75) scoreLabel = 'Good';
  else if (finalScore >= 60) scoreLabel = 'Fair';

  // 5. Generate Strengths (Deterministic & Rule-Based)
  const strengths = [];
  if (resume.projects && resume.projects.length >= 3) {
    strengths.push('Strong project portfolio containing multiple practical works.');
  } else if (resume.projects && resume.projects.length > 0) {
    strengths.push('Good project representation validating hands-on capacity.');
  }

  if (keywordMatchPercent >= 70) {
    strengths.push('Excellent keyword alignment with the core job description requirements.');
  } else if (keywordMatchPercent >= 40) {
    strengths.push('Moderate alignment with the core job description keywords.');
  }

  if (resume.certifications && resume.certifications.length > 0) {
    strengths.push('Relevant certifications present, indicating validated expertise.');
  }

  if (profileCompletenessScore >= 8) {
    strengths.push('Complete profile details and contact information provided.');
  }

  if (resume.experience && resume.experience.length >= 2) {
    strengths.push('Robust professional work history.');
  }

  // Domain alignment flags
  const hasExpDomainAlignment = resume.experience && resume.experience.some(e => {
    const text = `${e.role} ${e.description}`.toLowerCase();
    return Array.from(normalizedJdMap.keys()).some(kw => text.includes(kw));
  });
  if (hasExpDomainAlignment) {
    strengths.push('Professional experience aligns well with the target job domain.');
  }

  const hasProjDomainAlignment = resume.projects && resume.projects.some(p => {
    const text = `${p.name} ${p.techStack} ${p.description}`.toLowerCase();
    return Array.from(normalizedJdMap.keys()).some(kw => text.includes(kw));
  });
  if (hasProjDomainAlignment) {
    strengths.push('Projects display relevant knowledge and domain-aligned skills.');
  }

  if (strengths.length === 0) {
    if (resume.education && resume.education.length > 0) {
      strengths.push('Professional resume layout containing educational background.');
    } else {
      strengths.push('Well-structured layout containing essential resume sections.');
    }
  }

  // 6. Generate Actionable Suggestions
  const suggestions = [];
  if (keywordMatchPercent < 70) {
    suggestions.push('Integrate more role-specific keywords directly from the job description.');
  }
  if (missingKeywords.length > 0) {
    const displayMissing = missingKeywords.slice(0, 4);
    suggestions.push(`Consider adding skills like: ${displayMissing.join(', ')} if you possess experience with them.`);
  }
  if (profileCompletenessScore < 8) {
    suggestions.push('Ensure your phone number, location, and professional profiles (LinkedIn/GitHub) are listed.');
  }
  if (!resume.education || resume.education.length === 0) {
    suggestions.push('Add an education section to document your degrees or qualifications.');
  }
  if (!resume.experience || resume.experience.length === 0) {
    suggestions.push('Incorporate professional work experience, internships, or freelance roles.');
  } else {
    // Check for metrics/quantified results in experience bullets
    const expText = resume.experience.map(e => e.description).join(' ');
    const hasMetrics = /\b\d+%\b|\b\$\d+|\b\d+\s*(?:million|thousand|users|percent|hours|projects)\b/i.test(expText);
    if (!hasMetrics) {
      suggestions.push('Include measurable achievements and metrics (e.g. "improved sales by 15%", "reduced latency by 40%") in your work experience bullet points.');
    }
  }
  if (!resume.projects || resume.projects.length === 0) {
    suggestions.push('Incorporate projects showcasing practical application of your skills.');
  }
  if (!resume.certifications || resume.certifications.length === 0) {
    suggestions.push('Consider listing professional certifications to validate your skills.');
  }

  return {
    score: finalScore,
    scoreLabel,
    keywordMatchPercent,
    matchedKeywords,
    missingKeywords,
    strengths,
    suggestions,
    breakdown: {
      keywordCoverage: keywordCoverageScore,
      profileCompleteness: profileCompletenessScore,
      education: educationScore,
      experience: experienceScore,
      projects: projectsScore,
      certifications: certificationsScore
    }
  };
}
