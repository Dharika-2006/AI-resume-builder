/**
 * Phase 8A AI Timeout and Abort Verification Test
 * - Mock-delays Groq completions to exceed the 15-second timeout limit.
 * - Assures AbortController signals completion termination.
 * - Verifies correct timeout exception handling.
 */

import groq from '../ai/groqClient.js';
import * as aiService from '../services/aiService.js';

async function runTimeoutTest() {
  console.log("🚀 Starting Phase 8A AI Timeout / Abort Controller Verification...\n");

  // Keep reference to the original method
  const originalCreate = groq.chat.completions.create;

  // Mock create to simulate a 20-second delay or handle abort signal
  groq.chat.completions.create = function (params, options) {
    const signal = options?.signal;
    return new Promise((resolve, reject) => {
      const delayId = setTimeout(() => {
        resolve({
          choices: [{ message: { content: 'Mock delayed completion response' } }]
        });
      }, 20000); // 20 seconds delay

      if (signal) {
        if (signal.aborted) {
          clearTimeout(delayId);
          reject(new DOMException('The user aborted a request.', 'AbortError'));
        }
        signal.addEventListener('abort', () => {
          clearTimeout(delayId);
          reject(new DOMException('The user aborted a request.', 'AbortError'));
        });
      }
    });
  };

  const startTime = Date.now();
  console.log("🧪 Test 1: Simulating delayed response (>15 seconds)...");
  
  try {
    await aiService.improveExperience("Drafting some work experience descriptions...");
    throw new Error("Assertion failed: The request succeeded instead of timing out.");
  } catch (err) {
    const elapsed = Date.now() - startTime;
    console.log(`  ✓ Caught expected timeout error: "${err.message}"`);
    console.log(`  ✓ Time elapsed: ${(elapsed / 1000).toFixed(2)} seconds (Limit: ${aiService.AI_TIMEOUT_MS / 1000}s)`);

    if (elapsed > 16000 || elapsed < 14500) {
      throw new Error(`Assertion failed: Timeout did not trigger near 15 seconds limit. Elapsed: ${elapsed}ms`);
    }
    if (err.message !== 'AI Request Timeout') {
      throw new Error(`Assertion failed: Expected "AI Request Timeout" error message, got "${err.message}"`);
    }
    console.log("  ✓ AbortController correctly canceled the request at the 15-second boundary.\n");
  } finally {
    // Restore original method
    groq.chat.completions.create = originalCreate;
  }

  console.log("==================================================");
  console.log("🎉 Phase 8A AI Timeout verification passed!");
  console.log("==================================================");
}

runTimeoutTest().catch(err => {
  console.error("❌ Timeout/Abort verification failed:", err);
  process.exit(1);
});
