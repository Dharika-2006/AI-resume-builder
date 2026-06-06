/**
 * Phase 8B AI Features Verification Test Suite
 * - Registers a user to obtain JWT.
 * - Saves a temporary resume with predefined skills (React, NodeJS).
 * - Tests Project Enhancement, Skill Suggestions, and Resume Tailoring.
 * - Asserts that suggestion lists are technical and do not contain existing/soft skills.
 * - Asserts that the Tailored Resume response is valid JSON matching the expected schema.
 * - Validates JWT route protection and ownership checks.
 * - Simulates slow completion to verify AbortController timeout terminations.
 * - Performs database cleanup.
 */

import prisma from '../config/prisma.js';
import groq from '../ai/groqClient.js';
import * as aiService from '../services/aiService.js';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log("🚀 Starting Phase 8B AI Optimization Suite End-to-End Verification...\n");

  const email = `api-test-8b-${Date.now()}@example.com`;
  const password = 'test-password-8b';
  const name = 'Phase 8B Tester';

  let token = '';
  let authHeaders = {};
  let userId = '';
  let resumeId = '';

  try {
    // ── STEP 1: Registration & Setup ──
    console.log("🧪 Step 1: User Registration via POST /auth/register");
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const regData = await regRes.json();
    
    if (!regRes.ok || !regData?.success || !regData?.data?.token) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }
    token = regData.data.token;
    userId = regData.data.user.id;
    authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    console.log(`  ✓ Registered. User ID: "${userId}"\n`);

    // ── STEP 2: Resume Setup ──
    console.log("🧪 Step 2: Resume Setup via POST /resumes");
    const resumeRes = await fetch(`${BASE_URL}/resumes`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Phase 8B Test Resume',
        template: 'MODERN',
        personalInfo: {
          name: 'Dharika Dev',
          email: 'dharika@example.com',
          summary: 'Motivated Full-Stack Developer with experience in web interfaces.'
        },
        skills: [
          { name: 'React' },
          { name: 'JavaScript' },
          { name: 'HTML' }
        ],
        experience: [
          {
            role: 'Software Developer Intern',
            company: 'Code LLC',
            startDate: '2023',
            endDate: 'Present',
            description: 'Helped implement interactive pages using React.'
          }
        ],
        projects: [
          {
            name: 'Task Manager Tool',
            techStack: 'React, localStorage',
            description: 'Developed a simple personal checklist tool.'
          }
        ]
      })
    });
    const resumeData = await resumeRes.json();
    if (!resumeRes.ok || !resumeData?.success || !resumeData?.data?.id) {
      throw new Error(`Resume creation failed: ${JSON.stringify(resumeData)}`);
    }
    resumeId = resumeData.data.id;
    console.log(`  ✓ Resume created. Resume ID: "${resumeId}"\n`);

    // ── STEP 3: POST /ai/improve-project ──
    console.log("🧪 Step 3: AI Project Enhancer via POST /ai/improve-project");
    const projectRes = await fetch(`${BASE_URL}/ai/improve-project`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ projectDescription: 'Developed a simple personal checklist tool.' })
    });
    const projectData = await projectRes.json();
    if (!projectRes.ok || !projectData?.success || !projectData?.data?.improvedText) {
      throw new Error(`Project enhancement failed: ${JSON.stringify(projectData)}`);
    }
    console.log(`  ✓ Project description enhanced successfully:\n    "${projectData.data.improvedText}"\n`);

    // ── STEP 4: POST /ai/suggest-skills ──
    console.log("🧪 Step 4: AI Skill Suggestions via POST /ai/suggest-skills");
    const skillsRes = await fetch(`${BASE_URL}/ai/suggest-skills`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ resumeId })
    });
    const skillsData = await skillsRes.json();
    if (!skillsRes.ok || !skillsData?.success || !Array.isArray(skillsData?.data?.suggestedSkills)) {
      throw new Error(`Skills suggestion failed: ${JSON.stringify(skillsData)}`);
    }

    const suggestions = skillsData.data.suggestedSkills;
    console.log(`  ✓ Skills suggested successfully: ${JSON.stringify(suggestions)}`);
    
    // Assertions for Skill Suggestions constraints
    const forbiddenSoftSkills = ['communication', 'leadership', 'teamwork', 'problem solving', 'time management'];
    const existingSkills = ['react', 'javascript', 'html'];
    
    suggestions.forEach(skill => {
      const lowerSkill = skill.toLowerCase();
      if (forbiddenSoftSkills.includes(lowerSkill)) {
        throw new Error(`Assertion failed: Suggester recommended forbidden soft skill "${skill}".`);
      }
      if (existingSkills.includes(lowerSkill)) {
        throw new Error(`Assertion failed: Suggester recommended existing skill "${skill}".`);
      }
    });
    console.log("  ✓ verified: Suggestions contain no soft skills or existing duplicates.\n");

    // ── STEP 5: POST /ai/tailor-resume ──
    console.log("🧪 Step 5: AI Resume Tailoring via POST /ai/tailor-resume");
    const tailorRes = await fetch(`${BASE_URL}/ai/tailor-resume`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        resumeId,
        jobDescription: 'Seeking an Aspiring Software Engineer with expertise in AWS, Docker, and CI/CD pipelines to build scalable cloud architectures.'
      })
    });
    const tailorData = await tailorRes.json();
    if (!tailorRes.ok || !tailorData?.success || !tailorData?.data) {
      throw new Error(`Resume tailoring failed: ${JSON.stringify(tailorData)}`);
    }

    const report = tailorData.data;
    console.log("  ✓ Tailor response JSON structure parsed successfully.");
    console.log(`    Optimized Summary: "${report.optimizedSummary}"`);
    console.log(`    Missing Keywords: ${JSON.stringify(report.missingKeywords)}`);
    console.log(`    Recommended Skills: ${JSON.stringify(report.recommendedSkills)}`);
    console.log(`    Experience Recommendations: ${JSON.stringify(report.experienceRecommendations)}`);
    console.log(`    Project Recommendations: ${JSON.stringify(report.projectRecommendations)}\n`);

    // Schema validations
    if (!report.optimizedSummary || !Array.isArray(report.missingKeywords) || !Array.isArray(report.recommendedSkills) || 
        !Array.isArray(report.experienceRecommendations) || !Array.isArray(report.projectRecommendations)) {
      throw new Error("Assertion failed: Response object layout does not match target schema.");
    }
    // Summary format constraint validation
    if (report.optimizedSummary.includes("Dharika") || report.optimizedSummary.includes("Candidate") || report.optimizedSummary.startsWith("I am") || report.optimizedSummary.startsWith("He is") || report.optimizedSummary.startsWith("She is")) {
      throw new Error(`Assertion failed: Optimized summary violates descriptor rules: "${report.optimizedSummary}"`);
    }
    console.log("  ✓ verified: Tailoring layout matches JSON output schema perfectly.\n");

    // ── STEP 6: Route Protections ──
    console.log("🧪 Step 6: Ownership Protection (403 Blocks)");
    const secondUserReg = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Second User',
        email: `second-8b-${Date.now()}@example.com`,
        password: 'another-password'
      })
    });
    const secondUserData = await secondUserReg.json();
    const secondHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secondUserData.data.token}`
    };

    // Cross-user Suggest Skills
    const secSkillsRes = await fetch(`${BASE_URL}/ai/suggest-skills`, {
      method: 'POST',
      headers: secondHeaders,
      body: JSON.stringify({ resumeId })
    });
    if (secSkillsRes.status !== 403) {
      throw new Error(`Expected 403 status code for cross-user skills call, received ${secSkillsRes.status}`);
    }
    console.log("  ✓ Cross-user skill suggestions blocked (403).");

    // Cross-user Tailor Resume
    const secTailorRes = await fetch(`${BASE_URL}/ai/tailor-resume`, {
      method: 'POST',
      headers: secondHeaders,
      body: JSON.stringify({ resumeId, jobDescription: 'Seeking AWS Cloud developer.' })
    });
    if (secTailorRes.status !== 403) {
      throw new Error(`Expected 403 status code for cross-user tailoring call, received ${secTailorRes.status}`);
    }
    console.log("  ✓ Cross-user resume tailoring blocked (403).\n");

    // Cleanup second user
    await prisma.user.delete({ where: { id: secondUserData.data.user.id } });

    // ── STEP 7: AbortController Timeout Checks ──
    console.log("🧪 Step 7: Timeout Interrupt Verification (AbortController)");
    
    // Backup original completions wrapper
    const originalCreate = groq.chat.completions.create;

    // Simulate 20-second delay for Groq completions create
    groq.chat.completions.create = function (params, options) {
      console.log("   [DEBUG MOCK] Mock create method invoked.");
      const signal = options?.signal;
      return new Promise((resolve, reject) => {
        const delayId = setTimeout(() => {
          console.log("   [DEBUG MOCK] setTimeout resolved (20s).");
          resolve({ choices: [{ message: { content: 'Mock delayed completion response' } }] });
        }, 20000);

        if (signal) {
          console.log(`   [DEBUG MOCK] Signal registered. Aborted: ${signal.aborted}`);
          if (signal.aborted) {
            clearTimeout(delayId);
            reject(new DOMException('The user aborted a request.', 'AbortError'));
          }
          signal.addEventListener('abort', () => {
            console.log("   [DEBUG MOCK] Abort event received!");
            clearTimeout(delayId);
            reject(new DOMException('The user aborted a request.', 'AbortError'));
          });
        }
      });
    };

    const startTime = Date.now();
    try {
      await aiService.improveProject('Testing timeout logic...');
      throw new Error("Assertion failed: The request succeeded instead of timing out.");
    } catch (err) {
      const elapsed = Date.now() - startTime;
      console.log(`  ✓ Caught expected timeout error: "${err.message}"`);
      console.log(`  ✓ Time elapsed: ${(elapsed / 1000).toFixed(2)} seconds`);

      if (elapsed > 16500 || elapsed < 14500) {
        throw new Error(`Assertion failed: Timeout did not trigger near 15 seconds limit. Elapsed: ${elapsed}ms`);
      }
      if (err.message !== 'AI Request Timeout') {
        throw new Error(`Assertion failed: Expected "AI Request Timeout" error message, got "${err.message}"`);
      }
      console.log("  ✓ AbortController correctly canceled active service thread at the 15s limit.\n");
    } finally {
      // Restore original method
      groq.chat.completions.create = originalCreate;
    }

  } catch (error) {
    console.error("❌ Test Script Finished with Error:", error.message);
    throw error;
  } finally {
    console.log("🧹 Running API database cleanup...");
    if (resumeId) {
      await prisma.resume.delete({ where: { id: resumeId } }).catch(() => {});
    }
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    console.log("  ✓ Database cleaned up successfully.\n");
  }

  console.log("==================================================");
  console.log("🎉 Phase 8B AI Optimization Suite verification passed!");
  console.log("==================================================");
}

runTests().catch(() => {
  process.exit(1);
});
