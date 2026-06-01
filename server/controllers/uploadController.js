/**
 * Upload Controller
 * Coordinates document text extraction and deterministic metadata parsing services.
 */

import multer from 'multer';
import { extractTextFromBuffer } from '../services/fileParserService.js';
import { parseResumeText } from '../ai/resumeParser.js';

// Setup multer memory storage (no persistent files saved to disk, keeping sandbox clean)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size limit
}).single('resume');

/**
 * POST /api/upload/resume
 * Processes form-data uploads containing PDF/DOCX resumes, extracts content, and returns parsed fields.
 */
export const uploadResume = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds the 10MB limit.',
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'An error occurred during file upload.',
      });
    }

    // Verify file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please upload a resume file under field name "resume".',
      });
    }

    try {
      const { buffer, mimetype, originalname } = req.file;

      // Extract raw text from file buffer
      const rawText = await extractTextFromBuffer(buffer, mimetype, originalname);

      if (!rawText || !rawText.trim()) {
        return res.status(422).json({
          success: false,
          message: 'Unable to extract text content from the uploaded document. The file might be scanned, empty, or password-protected.',
        });
      }

      // Parse fields out of extracted text
      const parsedResults = parseResumeText(rawText);

      // Extract a clean project title from the uploaded filename (e.g. "John_Doe_CV.pdf" -> "John Doe CV")
      const cleanTitle = originalname
        .replace(/\.[^/.]+$/, '') // strip extension
        .replace(/[_-]/g, ' ')     // replace underscores and dashes with spaces
        .replace(/\s+/g, ' ')      // remove double spaces
        .trim();

      const formattedTitle = cleanTitle
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      parsedResults.parsedData.title = formattedTitle;

      return res.status(200).json({
        success: true,
        message: 'Resume parsed successfully',
        data: parsedResults,
      });
    } catch (parseError) {
      console.error('[UploadController Error]', parseError);
      return res.status(400).json({
        success: false,
        message: parseError.message || 'Failed to process and parse uploaded resume file.',
      });
    }
  });
};
