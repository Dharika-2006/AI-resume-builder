import prisma from '../config/prisma.js';
import * as aiService from '../services/aiService.js';

/**
 * Helper to check if a resume belongs to the logged-in user
 * @param {string} resumeId - Resume UUID
 * @param {string} userId - Auth User UUID
 * @returns {Promise<boolean>} Owner or not
 */
async function verifyResumeOwnership(resumeId, userId) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: userId,
    },
    select: { id: true },
  });
  return !!resume;
}

/**
 * POST /api/ai/generate-summary
 * Generates an executive summary utilizing resume details.
 */
export const handleGenerateSummary = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required.',
      });
    }

    // Verify ownership
    const isOwner = await verifyResumeOwnership(resumeId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const summary = await aiService.generateSummary(resumeId);

    // Log AI Activity
    await prisma.aIActivity.create({
      data: {
        userId: req.user.id,
        type: 'SUMMARY',
      },
    });

    return res.status(200).json({
      success: true,
      data: { summary },
    });
  } catch (error) {
    console.error('[handleGenerateSummary] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};

/**
 * POST /api/ai/improve-experience
 * Polishes experience bullet text using action-oriented language.
 */
export const handleImproveExperience = async (req, res) => {
  try {
    const { experienceText } = req.body;

    if (!experienceText || typeof experienceText !== 'string' || !experienceText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Experience text is required.',
      });
    }

    const improvedText = await aiService.improveExperience(experienceText);

    // Log AI Activity
    await prisma.aIActivity.create({
      data: {
        userId: req.user.id,
        type: 'EXPERIENCE',
      },
    });

    return res.status(200).json({
      success: true,
      data: { improvedText },
    });
  } catch (error) {
    console.error('[handleImproveExperience] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};

/**
 * POST /api/ai/ats-insights
 * Explains ATS rules score and lists roadmap suggestions.
 */
export const handleAtsInsights = async (req, res) => {
  try {
    const { analysisId } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        success: false,
        message: 'Analysis ID is required.',
      });
    }

    // Verify analysis record belongs to the logged-in user
    const analysis = await prisma.aTSAnalysis.findFirst({
      where: {
        id: analysisId,
        userId: req.user.id,
      },
      select: { id: true },
    });

    if (!analysis) {
      return res.status(403).json({
        success: false,
        message: 'Access denied or analysis report not found.',
      });
    }

    const insights = await aiService.getAtsInsights(analysisId);

    // Log AI Activity
    await prisma.aIActivity.create({
      data: {
        userId: req.user.id,
        type: 'ATS_INSIGHTS',
      },
    });

    return res.status(200).json({
      success: true,
      data: { insights },
    });
  } catch (error) {
    console.error('[handleAtsInsights] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};

/**
 * POST /api/ai/improve-project
 * Polishes project description text using action-oriented language.
 */
export const handleImproveProject = async (req, res) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription || typeof projectDescription !== 'string' || !projectDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Project description is required.',
      });
    }

    const improvedText = await aiService.improveProject(projectDescription);

    // Log AI Activity
    await prisma.aIActivity.create({
      data: {
        userId: req.user.id,
        type: 'PROJECT',
      },
    });

    return res.status(200).json({
      success: true,
      data: { improvedText },
    });
  } catch (error) {
    console.error('[handleImproveProject] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};

/**
 * POST /api/ai/suggest-skills
 * Suggests technical/functional skills using full resume context.
 */
export const handleSuggestSkills = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required.',
      });
    }

    const isOwner = await verifyResumeOwnership(resumeId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const suggestedSkills = await aiService.suggestSkills(resumeId);

    // Log AI Activity
    await prisma.aIActivity.create({
      data: {
        userId: req.user.id,
        type: 'SKILLS',
      },
    });

    return res.status(200).json({
      success: true,
      data: { suggestedSkills },
    });
  } catch (error) {
    console.error('[handleSuggestSkills] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};

/**
 * POST /api/ai/tailor-resume
 * Compares candidate resume with target JD and recommends structural updates.
 */
export const handleTailorResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: 'Resume ID is required.',
      });
    }

    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required.',
      });
    }

    const isOwner = await verifyResumeOwnership(resumeId, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const tailoredData = await aiService.tailorResume(resumeId, jobDescription);

    // Log AI Activity
    await prisma.aIActivity.create({
      data: {
        userId: req.user.id,
        type: 'TAILOR',
      },
    });

    return res.status(200).json({
      success: true,
      data: tailoredData,
    });
  } catch (error) {
    console.error('[handleTailorResume] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI service temporarily unavailable.',
    });
  }
};
