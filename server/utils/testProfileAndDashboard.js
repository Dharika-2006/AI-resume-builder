/**
 * End-to-End Verification Test Suite
 * - Profile Page & Dashboard Enhancements
 */

import prisma from '../config/prisma.js';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log("🚀 Starting Profile & Dashboard Enhancements Verification...\n");

  const email1 = `profile-test-1-${Date.now()}@example.com`;
  const email2 = `profile-test-2-${Date.now()}@example.com`;
  const password = 'test-password';
  
  let token1 = '';
  let authHeaders1 = {};
  let userId1 = '';
  
  let token2 = '';
  let authHeaders2 = {};
  let userId2 = '';

  let resumeId = '';
  let analysisId = '';

  try {
    // ── STEP 1: Registration ──
    console.log("🧪 Step 1: User Registration");
    const regRes1 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User One', email: email1, password })
    });
    const regData1 = await regRes1.json();
    if (!regRes1.ok || !regData1.success) {
      throw new Error(`Registration 1 failed: ${JSON.stringify(regData1)}`);
    }
    token1 = regData1.data.token;
    userId1 = regData1.data.user.id;
    authHeaders1 = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    };

    const regRes2 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'User Two', email: email2, password })
    });
    const regData2 = await regRes2.json();
    if (!regRes2.ok || !regData2.success) {
      throw new Error(`Registration 2 failed: ${JSON.stringify(regData2)}`);
    }
    token2 = regData2.data.token;
    userId2 = regData2.data.user.id;
    authHeaders2 = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token2}`
    };
    console.log("  ✓ Both users registered successfully.\n");

    // ── STEP 2: Profile Update ──
    console.log("🧪 Step 2: Profile Updates via PUT /auth/profile");
    const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: authHeaders1,
      body: JSON.stringify({
        name: 'User One Updated',
        email: `updated-${email1}`,
        password: 'new-secure-password'
      })
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok || !updateData.success) {
      throw new Error(`Profile update failed: ${JSON.stringify(updateData)}`);
    }
    if (updateData.data.user.name !== 'User One Updated' || updateData.data.user.email !== `updated-${email1}`) {
      throw new Error(`Profile update did not persist fields: ${JSON.stringify(updateData.data.user)}`);
    }
    console.log("  ✓ Profile name, email, and password updated successfully.");

    // Verify email collision
    const collisionRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: authHeaders1,
      body: JSON.stringify({
        name: 'User One Collision',
        email: email2 // Trying to steal User Two's email
      })
    });
    if (collisionRes.status !== 409) {
      throw new Error(`Expected 409 Conflict status code on email collision, received ${collisionRes.status}`);
    }
    console.log("  ✓ Collision validation blocked email conflicts successfully.\n");

    // ── STEP 3: Setup Resume & Scan for stats ──
    console.log("🧪 Step 3: Populate Data for Stats Calculations");
    const resumeRes = await fetch(`${BASE_URL}/resumes`, {
      method: 'POST',
      headers: authHeaders1,
      body: JSON.stringify({
        title: 'Developer Resume',
        template: 'MODERN',
        personalInfo: {
          name: 'User One Updated',
          email: `updated-${email1}`
        }
      })
    });
    const resumeData = await resumeRes.json();
    if (!resumeRes.ok || !resumeData.success) {
      throw new Error(`Resume setup failed: ${JSON.stringify(resumeData)}`);
    }
    resumeId = resumeData.data.id;

    // Run ATS scan
    const scanRes = await fetch(`${BASE_URL}/ats/analyze`, {
      method: 'POST',
      headers: authHeaders1,
      body: JSON.stringify({
        resumeId,
        jobDescription: 'Software engineer looking for React developer.'
      })
    });
    const scanData = await scanRes.json();
    if (!scanRes.ok || !scanData.success) {
      throw new Error(`ATS scan setup failed: ${JSON.stringify(scanData)}`);
    }
    analysisId = scanData.data.id;
    console.log(`  ✓ Data saved. Resume ID: "${resumeId}", Analysis ID: "${analysisId}"\n`);

    // ── STEP 4: Insert AI logs ──
    console.log("🧪 Step 4: AIActivity Log Verification");
    // Insert logs directly in database to simulate multiple tool uses
    await prisma.aIActivity.createMany({
      data: [
        { userId: userId1, type: 'SUMMARY' },
        { userId: userId1, type: 'EXPERIENCE' },
        { userId: userId1, type: 'EXPERIENCE' },
        { userId: userId1, type: 'SKILLS' },
        { userId: userId1, type: 'TAILOR' }
      ]
    });
    console.log("  ✓ AI activities logged successfully.");

    // ── STEP 5: Dashboard Stats Query ──
    console.log("🧪 Step 5: Dashboard Stats Calculation via GET /auth/dashboard-stats");
    const statsRes = await fetch(`${BASE_URL}/auth/dashboard-stats`, {
      method: 'GET',
      headers: authHeaders1
    });
    const statsData = await statsRes.json();
    if (!statsRes.ok || !statsData.success || !statsData.data) {
      throw new Error(`Failed to query stats: ${JSON.stringify(statsData)}`);
    }

    const { metrics, aiStats, scoreHistory, recentActivity } = statsData.data;

    // Verify metrics counts
    if (metrics.totalResumes !== 1) {
      throw new Error(`Assertion failed: expected 1 resume, got ${metrics.totalResumes}`);
    }
    if (metrics.totalAnalyses !== 1) {
      throw new Error(`Assertion failed: expected 1 analysis, got ${metrics.totalAnalyses}`);
    }
    if (metrics.aiGenerations !== 5) {
      throw new Error(`Assertion failed: expected 5 AI generations, got ${metrics.aiGenerations}`);
    }
    if (metrics.tailoredResumesCount !== 1) {
      throw new Error(`Assertion failed: expected 1 tailored resume, got ${metrics.tailoredResumesCount}`);
    }
    console.log("  ✓ Checked counts: Resumes, Analyses, AI operations, and Tailored items.");

    // Verify AI Stats breakdowns
    if (aiStats.SUMMARY !== 1 || aiStats.EXPERIENCE !== 2 || aiStats.SKILLS !== 1 || aiStats.TAILOR !== 1) {
      throw new Error(`Assertion failed: unexpected AI breakdown: ${JSON.stringify(aiStats)}`);
    }
    console.log("  ✓ Checked AI usage breakdowns by categories.");

    // Verify recent activity feed
    if (!Array.isArray(recentActivity) || recentActivity.length === 0) {
      throw new Error("Assertion failed: recent activity feed is empty.");
    }
    console.log(`  ✓ Dynamic Recent Activity feed items parsed (${recentActivity.length} events logged).`);
    recentActivity.forEach((act, idx) => {
      console.log(`    [${idx + 1}] ${act.message} (${act.type})`);
    });
    console.log("");

    // Verify trend score history
    if (!Array.isArray(scoreHistory) || scoreHistory.length !== 1) {
      throw new Error(`Assertion failed: expected 1 score history, got ${scoreHistory.length}`);
    }
    console.log("  ✓ Score trend logs checked.\n");

  } catch (error) {
    console.error("❌ Test Script Finished with Error:", error.message);
    process.exit(1);
  } finally {
    console.log("🧹 Running API database cleanup...");
    // Cleanup User 1
    if (resumeId) {
      await prisma.resume.delete({ where: { id: resumeId } }).catch(() => {});
    }
    if (userId1) {
      await prisma.user.delete({ where: { id: userId1 } }).catch(() => {});
    }
    // Cleanup User 2
    if (userId2) {
      await prisma.user.delete({ where: { id: userId2 } }).catch(() => {});
    }
    console.log("  ✓ Database cleaned up successfully.\n");
  }

  console.log("==================================================");
  console.log("🎉 Profile & Dashboard enhancements verification passed!");
  console.log("==================================================");
}

runTests();
