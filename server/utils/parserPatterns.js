/**
 * Deterministic Resume Parsing Regex Patterns
 * Separates pattern matching rules from formatting and flow logic.
 */

export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// Captures local/international formats (e.g. +1-123-456-7890, (123) 456-7890, 123.456.7890)
export const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

export const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
export const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;

export const SUMMARY_HEADERS = /^(summary|professional summary|about me|profile|objective|summary of qualifications)$/i;
export const EDUCATION_HEADERS = /^(education|academic history|academic background|qualifications|academic credentials)$/i;
export const EXPERIENCE_HEADERS = /^(experience|work experience|professional experience|employment|work history|employment history|leadership|leadership\s*&\s*extracurricular\s*experience|leadership\s*(?:&|and)\s*experience|leadership\s*experience|co-curricular\s*experience)$/i;
export const PROJECT_HEADERS = /^(projects|academic projects|personal projects|technical projects)$/i;
export const SKILLS_HEADERS = /^(skills|technical skills|key skills|core competencies|technologies|expertise|programming languages)$/i;
export const CERTIFICATION_HEADERS = /^(certifications|certificates|licenses|credentials)$/i;
