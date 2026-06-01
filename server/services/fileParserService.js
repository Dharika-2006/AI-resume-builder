/**
 * File Parser Service
 * Handles core file buffer reading for PDF and DOCX documents.
 * Returns raw, unparsed string values.
 */

import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts raw text from document buffer based on mimetype or extension
 * @param {Buffer} buffer - Raw file buffer
 * @param {string} mimeType - Document mime-type
 * @param {string} filename - Original name of uploaded file
 * @returns {Promise<string>} Raw text content
 */
export async function extractTextFromBuffer(buffer, mimeType, filename = '') {
  const name = filename.toLowerCase();
  const isPdf = mimeType === 'application/pdf' || name.endsWith('.pdf');
  const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                  mimeType === 'application/octet-stream' ||
                  name.endsWith('.docx');

  if (isPdf) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText({ parseHyperlinks: true });
      return result.text || '';
    } finally {
      await parser.destroy();
    }
  }

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }

  throw new Error('Unsupported document format. Only PDF and DOCX files are allowed.');
}
