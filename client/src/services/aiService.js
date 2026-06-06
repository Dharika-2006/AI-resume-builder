import api from './api';

/**
 * AI Service API Interface
 * Connects frontend editor controls with backend Groq completions.
 */
export const aiService = {
  /**
   * Generates a professional summary from resume items
   * @param {string} resumeId - Resume UUID
   * @returns {Promise<object>} API response data
   */
  generateSummary: async (resumeId) => {
    const response = await api.post('/ai/generate-summary', { resumeId });
    return response.data;
  },

  /**
   * Improves a single work experience description professionally
   * @param {string} experienceText - Raw bullet point text
   * @returns {Promise<object>} API response data
   */
  improveExperience: async (experienceText) => {
    const response = await api.post('/ai/improve-experience', { experienceText });
    return response.data;
  },

  /**
   * Generates a rich improvement roadmap and explanation for an ATS score report
   * @param {string} analysisId - Saved ATSAnalysis UUID
   * @returns {Promise<object>} API response data
   */
  getAtsInsights: async (analysisId) => {
    const response = await api.post('/ai/ats-insights', { analysisId });
    return response.data;
  },

  /**
   * Polishes project description text using action-oriented language
   * @param {string} projectDescription - Raw project description text
   * @returns {Promise<object>} API response data
   */
  improveProject: async (projectDescription) => {
    const response = await api.post('/ai/improve-project', { projectDescription });
    return response.data;
  },

  /**
   * Suggests technical/functional skills using full resume context
   * @param {string} resumeId - Resume UUID
   * @returns {Promise<object>} API response data
   */
  suggestSkills: async (resumeId) => {
    const response = await api.post('/ai/suggest-skills', { resumeId });
    return response.data;
  },

  /**
   * Compares candidate resume with target JD and recommends structural updates
   * @param {string} resumeId - Resume UUID
   * @param {string} jobDescription - Target Job Description text
   * @returns {Promise<object>} API response data
   */
  tailorResume: async (resumeId, jobDescription) => {
    const response = await api.post('/ai/tailor-resume', { resumeId, jobDescription });
    return response.data;
  },
};
