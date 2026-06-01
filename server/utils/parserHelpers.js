/**
 * Deterministic Resume Parsing Utility Helpers
 * Keeps resumeParser.js clean, readable, and modular as the engine scales.
 */

import {
  SUMMARY_HEADERS,
  EDUCATION_HEADERS,
  EXPERIENCE_HEADERS,
  PROJECT_HEADERS,
  SKILLS_HEADERS,
  CERTIFICATION_HEADERS
} from './parserPatterns.js';

/**
 * Standardizes multiple spaces, tabs, and line break groupings into single spaces
 */
export function normalizeWhitespace(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Strips common bullet point prefix symbols (•, -, *, and Unicode variants) and trims
 */
export function cleanSectionText(line) {
  if (!line) return '';
  return line.replace(/^[•\-\*\s\u2022\u00b7\u25aa]+/, '').trim();
}

/**
 * Segments lines of a resume into mapped section line blocks
 */
export function extractSections(lines) {
  const sections = {
    summary: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: []
  };

  let currentSection = '';

  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    // Check if line matches a main section header
    if (SUMMARY_HEADERS.test(cleanLine)) {
      currentSection = 'summary';
    } else if (EDUCATION_HEADERS.test(cleanLine)) {
      currentSection = 'education';
    } else if (EXPERIENCE_HEADERS.test(cleanLine)) {
      currentSection = 'experience';
    } else if (PROJECT_HEADERS.test(cleanLine)) {
      currentSection = 'projects';
    } else if (SKILLS_HEADERS.test(cleanLine)) {
      currentSection = 'skills';
    } else if (CERTIFICATION_HEADERS.test(cleanLine)) {
      currentSection = 'certifications';
    } else if (currentSection) {
      sections[currentSection].push(cleanLine);
    }
  }

  return sections;
}

/**
 * Filter utility to deduplicate an array of values or object hashes by a specific case-insensitive key
 */
export function deduplicateByKey(array, key) {
  if (!Array.isArray(array)) return [];
  const seen = new Set();
  return array.filter((item) => {
    if (!item) return false;
    const rawVal = key ? item[key] : item;
    if (typeof rawVal !== 'string') return true; // Keep non-string objects/arrays or inspect next
    const cleanVal = rawVal.toLowerCase().replace(/\s+/g, '').trim();
    if (!cleanVal || seen.has(cleanVal)) return false;
    seen.add(cleanVal);
    return true;
  });
}

/**
 * Guarantees a safe array reference in case of bad formatting inputs
 */
export function safeArray(array) {
  return Array.isArray(array) ? array : [];
}
