/**
 * ATS Analyzer Final Polish & Validation Script
 * - Asserts synonym keyword normalization mapping ("NodeJS" -> "Node.js").
 * - Tests multiple domains (Software, Marketing, HR, Finance, Teaching).
 * - Verifies strength quality and suggestion actionability.
 */

import { analyzeResume, normalizeKeyword, getPrettyName } from '../services/atsService.js';

const mockResume = {
  id: "test-resume-uuid",
  title: "Dharika Resume",
  description: "Senior engineer and multi-domain specialist with proven experience.",
  personalInfo: {
    name: "Dharika",
    email: "dharika@example.com",
    phone: "123-456-7890",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/dharika"
  },
  skills: [
    { name: "NodeJS" }, // Synonym tests
    { name: "react.js" }, // Synonym tests
    { name: "REST APIs" }, // Synonym tests
    { name: "Excel" },
    { name: "AutoCAD" },
    { name: "SolidWorks" },
    { name: "Curriculum Design" }
  ],
  education: [
    { degree: "Bachelor of Science", institution: "University of Technology" }
  ],
  experience: [
    {
      role: "Lead Software Architect",
      company: "Innovate LLC",
      description: "Successfully built server architectures using node.js, rest api endpoints, and react. Managed a team of 4 engineers." // Check metrics & synonyms
    },
    {
      role: "Design Engineer",
      company: "Machina Corp",
      description: "Drafted blueprint specifications with AutoCAD. Led Six Sigma quality circles."
    }
  ],
  projects: [
    {
      name: "Distributed DB",
      techStack: "Express, redis",
      description: "Engineered scalable cloud caching layer."
    },
    {
      name: "Frictionless Slider Component",
      techStack: "React, CSS",
      description: "Designed UI widgets."
    },
    {
      name: "Solar Truss Analysis",
      techStack: "SolidWorks",
      description: "Analyzed load structural tolerances."
    }
  ],
  certifications: [
    { name: "Project Management Professional (PMP)", issuer: "Project Management Institute" }
  ]
};

const testDomainsJDs = {
  Software: {
    jd: "Seeking a Software Engineer with expertise in react, node.js, AWS, and REST API.",
    expectedMatches: ["React", "Node.js", "REST API"],
  },
  Marketing: {
    jd: "Looking for a Marketing Specialist to drive SEO, Google Analytics, Campaign Management, and Social Media Marketing.",
    expectedMatches: [],
  },
  HR: {
    jd: "Hiring an HR Specialist for Recruitment, Talent Acquisition, and Employee Relations.",
    expectedMatches: [],
  },
  Finance: {
    jd: "Requirements: Financial modeling, Excel, forecasting, and Budgeting.",
    expectedMatches: ["Excel"],
  },
  Teaching: {
    jd: "Hiring a Teacher. Skills: Lesson Planning, Curriculum Design, and Classroom Management.",
    expectedMatches: ["Curriculum Design"],
  }
};

async function runValidation() {
  console.log("🛠️ Starting Phase 7 ATS Analyzer Final Polish & Validation...\n");

  // 1. Synonym Keyword Normalization Verification
  console.log("🧪 Test 1: Synonym Normalization");
  const testSynonyms = [
    { input: "Node", expected: "node.js" },
    { input: "nodejs", expected: "node.js" },
    { input: "reactjs", expected: "react" },
    { input: "js", expected: "javascript" },
    { input: "REST APIs", expected: "rest api" }
  ];

  testSynonyms.forEach(test => {
    const norm = normalizeKeyword(test.input);
    if (norm !== test.expected) {
      throw new Error(`Normalization failure: Input "${test.input}" returned "${norm}", expected "${test.expected}"`);
    }
    console.log(`  ✓ normalized "${test.input}" -> "${norm}" [Pretty: "${getPrettyName(norm)}"]`);
  });
  console.log("  ✅ Keyword Normalization works perfectly!\n");

  // 2. Multi-Domain Verification
  for (const [domain, spec] of Object.entries(testDomainsJDs)) {
    console.log(`🧪 Test 2: Domain - ${domain}`);
    const result = await analyzeResume(mockResume, spec.jd);

    console.log(`  Score:            ${result.score}/100 (${result.scoreLabel})`);
    console.log(`  Keyword Match %:  ${result.keywordMatchPercent}%`);
    console.log(`  Matched:          ${JSON.stringify(result.matchedKeywords)}`);
    console.log(`  Missing:          ${JSON.stringify(result.missingKeywords)}`);
    
    // Assert matches are correct
    spec.expectedMatches.forEach(expected => {
      if (!result.matchedKeywords.includes(expected)) {
        throw new Error(`Assertion failure: Expected keyword match "${expected}" not found for ${domain}`);
      }
    });

    // 3. Strength Quality Check
    console.log("  Strengths:");
    result.strengths.forEach(str => {
      console.log(`    - ${str}`);
      // Assert strength is meaningful
      if (str.toLowerCase().includes("exists") || str.toLowerCase().includes("has skills")) {
        throw new Error(`Assertion failure: Invalid generic strength returned: "${str}"`);
      }
    });

    // 4. Actionable Suggestion Quality Check
    console.log("  Suggestions:");
    result.suggestions.forEach(sug => {
      console.log(`    - ${sug}`);
      // Assert suggestions are actionable
      if (sug.toLowerCase().includes("improve resume") || sug.toLowerCase().includes("add more content")) {
        throw new Error(`Assertion failure: Invalid generic suggestion returned: "${sug}"`);
      }
    });

    console.log(`  ✅ ${domain} checks passed.\n`);
  }

  console.log("==================================================");
  console.log("🎉 All Final Polish & Validation test cases passed!");
  console.log("==================================================");
}

runValidation().catch(err => {
  console.error("❌ Validation failed:", err);
  process.exit(1);
});
