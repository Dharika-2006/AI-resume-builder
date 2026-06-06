import Groq from 'groq-sdk';

// Initialize the official Groq SDK client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

// Centralized model selection for Phase 8A
export const GROQ_MODEL = 'llama-3.3-70b-versatile';

export default groq;
