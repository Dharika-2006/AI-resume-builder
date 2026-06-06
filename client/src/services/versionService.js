import api from './api';

/**
 * Version Service API Interface
 * - Manages history snapshots, restores, and comparisons for resumes
 */
export const versionService = {
  /**
   * Creates a snapshot version of the current resume state
   */
  createSnapshot: async (resumeId, { reason, createdByAI = false }) => {
    return api.post(`/resumes/${resumeId}/versions`, { reason, createdByAI });
  },

  /**
   * Fetches the snapshot list (history) of a resume
   */
  getVersionHistory: async (resumeId) => {
    return api.get(`/resumes/${resumeId}/versions`);
  },

  /**
   * Fetches details of a specific version snapshot
   */
  getVersionDetails: async (resumeId, versionId) => {
    return api.get(`/resumes/${resumeId}/versions/${versionId}`);
  },

  /**
   * Restores a resume to a past version snapshot
   */
  restoreVersion: async (resumeId, versionId) => {
    return api.post(`/resumes/${resumeId}/versions/${versionId}/restore`);
  },

  /**
   * Compares two versions side-by-side (left vs right)
   */
  compareVersions: async (resumeId, leftId, rightId) => {
    return api.get(`/resumes/${resumeId}/compare?left=${leftId}&right=${rightId}`);
  },
};
