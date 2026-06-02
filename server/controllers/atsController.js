import prisma from '../config/prisma.js';
import { analyzeResume } from '../services/atsService.js';
import { resumeIncludes } from '../utils/resumeIncludes.js';

/**
 * POST /api/ats/analyze
 * Analyzes a resume against a job description.
 * Saves the outcome in the ATSAnalysis table.
 */
export const analyzeATS = async (req, res) => {
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
        message: 'Job description text is required.',
      });
    }

    // Verify user ownership and load all resume sections
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: req.user.id,
      },
      include: resumeIncludes,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or access denied.',
      });
    }

    // Run rules-based parser and score calculator
    const result = await analyzeResume(resume, jobDescription);

    // Save scan to user history using dedicated database columns
    const analysis = await prisma.aTSAnalysis.create({
      data: {
        score: result.score,
        scoreLabel: result.scoreLabel,
        keywordMatchPercent: result.keywordMatchPercent,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        strengths: result.strengths,
        suggestions: result.suggestions,
        breakdown: result.breakdown,
        userId: req.user.id,
        resumeId: resume.id,
      },
      include: {
        resume: {
          select: {
            title: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'ATS analysis completed successfully.',
      data: {
        id: analysis.id,
        score: result.score,
        scoreLabel: result.scoreLabel,
        keywordMatchPercent: result.keywordMatchPercent,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords,
        strengths: result.strengths,
        suggestions: result.suggestions,
        breakdown: result.breakdown,
        resumeTitle: resume.title,
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error('[analyzeATS]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while analyzing resume.',
    });
  }
};

/**
 * GET /api/ats/history
 * Fetches all past ATS analyses for the logged-in user.
 */
export const getATSHistory = async (req, res) => {
  try {
    const history = await prisma.aTSAnalysis.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        resume: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedHistory = history.map(item => {
      return {
        id: item.id,
        score: item.score,
        scoreLabel: item.scoreLabel,
        keywordMatchPercent: item.keywordMatchPercent,
        matchedKeywords: item.matchedKeywords,
        missingKeywords: item.missingKeywords,
        strengths: item.strengths,
        suggestions: item.suggestions,
        breakdown: item.breakdown,
        resumeId: item.resumeId,
        resumeTitle: item.resume?.title || 'Deleted Resume',
        createdAt: item.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'ATS scan history retrieved successfully.',
      data: mappedHistory,
    });
  } catch (error) {
    console.error('[getATSHistory]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching ATS scan history.',
    });
  }
};
