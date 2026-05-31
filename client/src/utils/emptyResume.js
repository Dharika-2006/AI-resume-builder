/**
 * Central Empty Resume Schema Definition
 * - Standardizes initial state layouts across Create Mode workspaces
 * - Keeps component states clean and prevents field dereference errors
 */
export const emptyResume = {
  title: 'Untitled Resume',
  template: 'MODERN',
  description: '',
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
};
