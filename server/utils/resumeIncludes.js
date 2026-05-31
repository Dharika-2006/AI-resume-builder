/**
 * Centralized Resume Query Includes
 * - Standardizes relation includes across create, read, and update queries
 * - Keeps database queries DRY and makes adding new resume sections simple
 */
export const resumeIncludes = {
  personalInfo: true,
  education: true,
  experience: true,
  projects: true,
  skills: true,
  certifications: true,
};
