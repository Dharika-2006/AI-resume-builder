import api from './api';

/**
 * Resume Service API Interface
 * - Connects frontend editing with secure backend endpoints
 * - Encapsulates all query triggers for resumes CRUD
 */
export const resumeService = {
  /**
   * Creates a new resume
   */
  createResume: async (payload) => {
    return api.post('/resumes', payload);
  },

  /**
   * Fetches a specific deep resume tree by ID
   */
  getResumeById: async (id) => {
    return api.get(`/resumes/${id}`);
  },

  /**
   * Updates an existing resume
   */
  updateResume: async (id, payload) => {
    return api.put(`/resumes/${id}`, payload);
  },
};
