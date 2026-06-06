/**
 * Phase 8A AI Endpoints Integration Test
 * - Tests registration and login to acquire JWT.
 * - Creates a temporary resume.
 * - Executes rules-based ATS analysis.
 * - Invokes AI Summary, Experience Polisher, and ATS Insights HTTP endpoints.
 * - Asserts correct response payloads and HTTP status codes (200, 201, 401, 403).
 * - Performs database cleanup.
 */

import prisma from '../config/prisma.js';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function testEndpoints() {
  console.log("🚀 Starting Phase 8A AI HTTP Endpoints Integration Test...\n");

  const email = `api-test-${Date.now()}@example.com`;
  const password = 'test-password-123';
  const name = 'API Test User';

  let token = '';
  let authHeaders = {};
  let userId = '';
  let resumeId = '';
  let analysisId = '';

  try {
    // 1. Register User
    console.log("🧪 Test 1: User Registration via POST /auth/register");
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
    console.log(`  ✓ Registration successful. User ID: "${userId}"\n`);

    // 2. Auth Access Validation (401 Check)
    console.log("🧪 Test 2: Unauthenticated Request Block via GET /auth/profile");
    const unauthRes = await fetch(`${BASE_URL}/auth/profile`);
    if (unauthRes.status !== 401) {
      throw new Error(`Security breach: expected 401, received ${unauthRes.status}`);
    }
    console.log("  ✓ Request correctly blocked with 401 Unauthorized.\n");

    // 3. Create Resume
    console.log("🧪 Test 3: Resume Creation via POST /resumes");
    const resumeRes = await fetch(`${BASE_URL}/resumes`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'API Verification Resume',
        template: 'MODERN',
        personalInfo: {
          name: 'Dharika Dev',
          email: 'dharika@example.com',
          summary: 'A talented backend engineer focusing on NodeJS.'
        },
        skills: [
          { name: 'NodeJS' },
          { name: 'JavaScript' },
          { name: 'PostgreSQL' }
        ],
        experience: [
          {
            role: 'Software Architect',
            company: 'SaaS Inc',
            startDate: '2024',
            endDate: 'Present',
            description: 'Designed and deployed distributed API endpoints.'
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

    // 4. Run ATS analysis
    console.log("🧪 Test 4: ATS Scan Run via POST /ats/analyze");
    const atsRes = await fetch(`${BASE_URL}/ats/analyze`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        resumeId,
        jobDescription: 'Seeking a NodeJS Backend Architect with skills in Docker and AWS.'
      })
    });
    const atsData = await atsRes.json();

    if (!atsRes.ok || !atsData?.success || !atsData?.data?.id) {
      throw new Error(`ATS scan report generation failed: ${JSON.stringify(atsData)}`);
    }
    analysisId = atsData.data.id;
    console.log(`  ✓ Scan finished. Analysis ID: "${analysisId}"`);
    console.log(`    Score: ${atsData.data.score} (${atsData.data.scoreLabel})`);
    console.log(`    Matched: ${JSON.stringify(atsData.data.matchedKeywords)}`);
    console.log(`    Missing: ${JSON.stringify(atsData.data.missingKeywords)}\n`);

    // 5. Generate Summary Endpoint (POST /ai/generate-summary)
    console.log("🧪 Test 5: AI Summary Generator via POST /ai/generate-summary");
    const summaryRes = await fetch(`${BASE_URL}/ai/generate-summary`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ resumeId })
    });
    const summaryData = await summaryRes.json();

    if (!summaryRes.ok || !summaryData?.success || !summaryData?.data?.summary) {
      throw new Error(`AI Summary endpoint returned failure: ${JSON.stringify(summaryData)}`);
    }
    console.log(`  ✓ Executive summary generated:\n    "${summaryData.data.summary}"\n`);

    // 6. Improve Experience Endpoint (POST /ai/improve-experience)
    console.log("🧪 Test 6: AI Experience Polisher via POST /ai/improve-experience");
    const expRes = await fetch(`${BASE_URL}/ai/improve-experience`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        experienceText: 'Designed and deployed distributed API endpoints.'
      })
    });
    const expData = await expRes.json();

    if (!expRes.ok || !expData?.success || !expData?.data?.improvedText) {
      throw new Error(`AI Experience endpoint returned failure: ${JSON.stringify(expData)}`);
    }
    console.log(`  ✓ Improved work description:\n    "${expData.data.improvedText}"\n`);

    // 7. ATS Insights Endpoint (POST /ai/ats-insights)
    console.log("🧪 Test 7: AI ATS Insights Roadmap via POST /ai/ats-insights");
    const insightsRes = await fetch(`${BASE_URL}/ai/ats-insights`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ analysisId })
    });
    const insightsData = await insightsRes.json();

    if (!insightsRes.ok || !insightsData?.success || !insightsData?.data?.insights) {
      throw new Error(`AI ATS Insights endpoint returned failure: ${JSON.stringify(insightsData)}`);
    }
    console.log(`  ✓ AI insights roadmap generated successfully (length: ${insightsData.data.insights.length} chars).\n`);

    // 8. Authorization/Ownership Checks (403 Checks)
    console.log("🧪 Test 8: Data Ownership Block (403 Checks)");
    
    // Create a second user to test cross-user access attempts
    const secondUserReg = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Second User',
        email: `second-${Date.now()}@example.com`,
        password: 'another-password'
      })
    });
    const secondUserData = await secondUserReg.json();
    const secondHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secondUserData.data.token}`
    };

    // Try to generate summary for first user's resume using second user's credentials
    const secSummaryRes = await fetch(`${BASE_URL}/ai/generate-summary`, {
      method: 'POST',
      headers: secondHeaders,
      body: JSON.stringify({ resumeId })
    });
    if (secSummaryRes.status !== 403) {
      throw new Error(`Expected 403 status code for cross-user summary call, received ${secSummaryRes.status}`);
    }
    console.log("  ✓ Successfully blocked unauthorized cross-user summary generation (403).");

    // Try to get insights for first user's analysis report using second user's credentials
    const secInsightsRes = await fetch(`${BASE_URL}/ai/ats-insights`, {
      method: 'POST',
      headers: secondHeaders,
      body: JSON.stringify({ analysisId })
    });
    if (secInsightsRes.status !== 403) {
      throw new Error(`Expected 403 status code for cross-user insights call, received ${secInsightsRes.status}`);
    }
    console.log("  ✓ Successfully blocked unauthorized cross-user insights retrieval (403).\n");

    // Clean up second user
    await prisma.user.delete({ where: { id: secondUserData.data.user.id } });

  } catch (error) {
    console.error("❌ Endpoints test execution failed:", error.message);
    throw error;
  } finally {
    console.log("🧹 Running API database cleanup...");
    if (analysisId) {
      await prisma.aTSAnalysis.delete({ where: { id: analysisId } }).catch(() => {});
    }
    if (resumeId) {
      await prisma.resume.delete({ where: { id: resumeId } }).catch(() => {});
    }
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    }
    console.log("  ✓ Database cleaned up successfully.\n");
  }

  console.log("==================================================");
  console.log("🎉 Phase 8A AI HTTP Endpoints verification passed!");
  console.log("==================================================");
}

testEndpoints().catch(err => {
  console.error("❌ Test Script Finished with Error.");
  process.exit(1);
});
