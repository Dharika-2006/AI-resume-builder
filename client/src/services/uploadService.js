/**
 * Upload Service
 * Communicates with the backend /upload endpoints to parse files.
 */

import api from './api';

export const uploadService = {
  /**
   * Sends a multipart form request containing a PDF/DOCX file to be parsed.
   * @param {File} file - The document file to upload
   * @returns {Promise<{ success: boolean, message: string, data: { parsedData: object, metadata: object } }>} Mapped parsed response from server
   */
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
