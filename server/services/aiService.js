import groq, { GROQ_MODEL } from '../ai/groqClient.js';
import prisma from '../config/prisma.js';
import { resumeIncludes } from '../utils/resumeIncludes.js';
import { SUMMARY_PROMPT, EXPERIENCE_PROMPT, ATS_INSIGHTS_PROMPT, PROJECT_PROMPT, SKILL_SUGGESTION_PROMPT, TAILOR_RESUME_PROMPT } from '../utils/aiPrompts.js';

// Shared constant for AI Request Timeout limits
export const AI_TIMEOUT_MS = 15000;

/**
 * Generic caller function wrapping Groq completions with abort signals and timeout limits
 * @param {string} systemPrompt - Instructions guiding LLM persona and guidelines
 * @param {string} userPrompt - Context and input content
 * @returns {Promise<string>} Trimmed LLM outcome
 */
async function getGroqCompletion(systemPrompt, userPrompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1024,
    }, { signal: controller.signal });

    return completion.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    if (error.name === 'AbortError' || error.message?.includes('abort')) {
      throw new Error('AI Request Timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Generates professional summaries using resume items
 * @param {string} resumeId - Target Resume UUID
 * @returns {Promise<string>} Generated Summary
 */
export async function generateSummary(resumeId) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId },
    include: resumeIncludes,
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  // Format resume details into structured key-values
  const profileParts = [];
  if (resume.personalInfo) {
    profileParts.push(`Name: ${resume.personalInfo.name || ''}`);
    profileParts.push(`Summary Context: ${resume.personalInfo.summary || ''}`);
  }
  
  if (resume.skills && resume.skills.length > 0) {
    profileParts.push(`Skills: ${resume.skills.map(s => s.name).join(', ')}`);
  }
  
  if (resume.experience && resume.experience.length > 0) {
    profileParts.push('Work History:');
    resume.experience.forEach((e, idx) => {
      profileParts.push(`${idx + 1}. Role: ${e.role}, Company: ${e.company}, Dates: ${e.startDate} to ${e.endDate || 'Present'}`);
      profileParts.push(`   Description: ${e.description}`);
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    profileParts.push('Projects:');
    resume.projects.forEach((p, idx) => {
      profileParts.push(`${idx + 1}. Title: ${p.name}, Stack: ${p.techStack}`);
      profileParts.push(`   Description: ${p.description}`);
    });
  }

  if (resume.education && resume.education.length > 0) {
    profileParts.push('Education:');
    resume.education.forEach((edu, idx) => {
      profileParts.push(`${idx + 1}. Degree: ${edu.degree}, Institution: ${edu.institution}, Year: ${edu.year}`);
    });
  }

  const userContext = profileParts.join('\n');
  return getGroqCompletion(SUMMARY_PROMPT, userContext);
}

/**
 * Enhances work experience descriptions professionally
 * @param {string} experienceText - Raw experience text
 * @returns {Promise<string>} Optimized description text
 */
export async function improveExperience(experienceText) {
  if (!experienceText || !experienceText.trim()) {
    throw new Error('No experience text provided');
  }
  return getGroqCompletion(EXPERIENCE_PROMPT, experienceText);
}

/**
 * Generates audit analysis reviews using rule-based metrics
 * @param {string} analysisId - Saved ATSAnalysis UUID
 * @returns {Promise<string>} Detailed insights roadmap
 */
export async function getAtsInsights(analysisId) {
  const analysis = await prisma.aTSAnalysis.findFirst({
    where: { id: analysisId },
  });

  if (!analysis) {
    throw new Error('Analysis report not found');
  }

  const analysisReport = [
    `ATS Score: ${analysis.score}/100`,
    `Keyword Match Rate: ${analysis.keywordMatchPercent}%`,
    `Matched Keywords: ${JSON.stringify(analysis.matchedKeywords || [])}`,
    `Missing Keywords: ${JSON.stringify(analysis.missingKeywords || [])}`,
    `Rules Recommendations: ${JSON.stringify(analysis.suggestions || [])}`
  ].join('\n');

  return getGroqCompletion(ATS_INSIGHTS_PROMPT, analysisReport);
}

/**
 * Polishes project descriptions professionally
 * @param {string} projectDescription - Raw project description text
 * @returns {Promise<string>} Optimized project description
 */
export async function improveProject(projectDescription) {
  if (!projectDescription || !projectDescription.trim()) {
    throw new Error('No project description provided');
  }
  return getGroqCompletion(PROJECT_PROMPT, projectDescription);
}

/**
 * Suggests technical, ATS-relevant skills using resume items
 * @param {string} resumeId - Target Resume UUID
 * @returns {Promise<string[]>} List of suggested skills
 */
export async function suggestSkills(resumeId) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId },
    include: resumeIncludes,
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  const contextParts = [];
  if (resume.skills && resume.skills.length > 0) {
    contextParts.push(`Current Skills: ${resume.skills.map(s => s.name).join(', ')}`);
  } else {
    contextParts.push(`Current Skills: None`);
  }

  if (resume.experience && resume.experience.length > 0) {
    contextParts.push('Work History Roles & Descriptions:');
    resume.experience.forEach((e) => {
      contextParts.push(`- Role: ${e.role}, Description: ${e.description}`);
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    contextParts.push('Projects:');
    resume.projects.forEach((p) => {
      contextParts.push(`- Title: ${p.name}, Description: ${p.description}, Stack: ${p.techStack}`);
    });
  }

  if (resume.education && resume.education.length > 0) {
    contextParts.push('Education:');
    resume.education.forEach((edu) => {
      contextParts.push(`- Degree: ${edu.degree}`);
    });
  }

  const userContext = contextParts.join('\n');
  const responseText = await getGroqCompletion(SKILL_SUGGESTION_PROMPT, userContext);

  try {
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('[suggestSkills] JSON parse failure:', responseText, err);
    throw new Error('Failed to parse suggested skills JSON.');
  }
}

/**
 * Tailors resume details to match a target job description
 * @param {string} resumeId - Target Resume UUID
 * @param {string} jobDescription - Target Job Description
 * @returns {Promise<object>} Object matching the tailored JSON schema
 */
export async function tailorResume(resumeId, jobDescription) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId },
    include: resumeIncludes,
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  const profileParts = [];
  if (resume.personalInfo) {
    profileParts.push(`Summary Context: ${resume.personalInfo.summary || ''}`);
  }
  if (resume.skills && resume.skills.length > 0) {
    profileParts.push(`Skills: ${resume.skills.map(s => s.name).join(', ')}`);
  }
  if (resume.experience && resume.experience.length > 0) {
    profileParts.push('Work History:');
    resume.experience.forEach((e, idx) => {
      profileParts.push(`${idx + 1}. Role: ${e.role}, Company: ${e.company}`);
      profileParts.push(`   Description: ${e.description}`);
    });
  }
  if (resume.projects && resume.projects.length > 0) {
    profileParts.push('Projects:');
    resume.projects.forEach((p, idx) => {
      profileParts.push(`${idx + 1}. Title: ${p.name}, Stack: ${p.techStack}`);
      profileParts.push(`   Description: ${p.description}`);
    });
  }
  if (resume.education && resume.education.length > 0) {
    profileParts.push('Education:');
    resume.education.forEach((edu, idx) => {
      profileParts.push(`${idx + 1}. Degree: ${edu.degree}, Institution: ${edu.institution}`);
    });
  }

  const userContext = [
    '=== CANDIDATE RESUME ===',
    profileParts.join('\n'),
    '=== TARGET JOB DESCRIPTION ===',
    jobDescription
  ].join('\n\n');

  const responseText = await getGroqCompletion(TAILOR_RESUME_PROMPT, userContext);

  try {
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (err) {
    console.error('[tailorResume] JSON parse failure:', responseText, err);
    throw new Error('Failed to parse tailored resume JSON.');
  }
}
