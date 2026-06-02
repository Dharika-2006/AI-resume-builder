import api from './api';

/**
 * ATS Service API Interface
 * Connects frontend analyzer with backend endpoints.
 */
export const atsService = {
  /**
   * Submits a resume and job description to the rules engine for analysis
   * @param {string} resumeId - Target Resume UUID
   * @param {string} jobDescription - Job requirements text
   * @returns {Promise<object>} API response data
   */
  analyzeResume: async (resumeId, jobDescription) => {
    const response = await api.post('/ats/analyze', { resumeId, jobDescription });
    return response.data;
  },

  /**
   * Fetches scan history for the authenticated user
   * @returns {Promise<object>} API response data
   */
  getHistory: async () => {
    const response = await api.get('/ats/history');
    return response.data;
  },
};
