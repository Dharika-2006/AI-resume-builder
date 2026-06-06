import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// ─── Helpers ────────────────────────────────────────────────

/**
 * Generates a signed JWT for the given user.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Strips the password field before sending user data.
 */
const sanitizeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

/**
 * Basic email format validation.
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ─── Controllers ────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new user account.
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Input validation ──
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // ── Duplicate check ──
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // ── Hash password ──
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ── Create user ──
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
    });

    // ── Generate token ──
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error('[register]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticates user and returns JWT.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Input validation ──
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // ── Find user ──
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── Verify password ──
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // ── Generate token ──
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error('[login]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
};

/**
 * GET /api/auth/profile
 * Returns the currently authenticated user's profile.
 * Protected — requires valid JWT via auth middleware.
 */
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // password intentionally omitted
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      data: { user },
    });
  } catch (error) {
    console.error('[getProfile]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile.',
    });
  }
};

/**
 * PUT /api/auth/profile
 * Updates the logged-in user's profile settings (name, email, password).
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    // Check email collision
    const targetEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const dataToUpdate = {
      name: name.trim(),
      email: targetEmail,
    };

    if (password && password.trim()) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long.',
        });
      }
      const salt = await bcrypt.genSalt(12);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error('[updateProfile]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile.',
    });
  }
};

/**
 * GET /api/auth/dashboard-stats
 * Dynamically computes dashboard statistics, activity feeds, and AI usage metrics for the logged-in user.
 */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Total Resumes and ATS Analysis counts
    const totalResumes = await prisma.resume.count({ where: { userId } });
    const totalAnalyses = await prisma.aTSAnalysis.count({ where: { userId } });

    // 2. Average and Best ATS Scores
    const scoreAggregate = await prisma.aTSAnalysis.aggregate({
      where: { userId },
      _avg: { score: true },
      _max: { score: true },
    });

    const averageAtsScore = scoreAggregate._avg.score ? Math.round(scoreAggregate._avg.score) : 0;
    const bestAtsScore = scoreAggregate._max.score || 0;

    // 3. AI Generations Count (dynamic from AIActivity logs)
    const aiGenerations = await prisma.aIActivity.count({ where: { userId } });

    // 3b. Versions Created Count (all versions for this user's resumes)
    const userResumes = await prisma.resume.findMany({
      where: { userId },
      select: { id: true }
    });
    const resumeIds = userResumes.map(r => r.id);

    const versionsCreated = await prisma.resumeVersion.count({
      where: { resumeId: { in: resumeIds } }
    });

    // 3c. AI Acceptance Rate
    const acceptedAiCount = await prisma.resumeVersion.count({
      where: {
        resumeId: { in: resumeIds },
        createdByAI: true
      }
    });

    const aiAcceptanceRate = aiGenerations > 0
      ? Math.min(100, Math.round((acceptedAiCount / aiGenerations) * 100))
      : 0;

    // 4. Breakdown of AI operations
    const aiActivities = await prisma.aIActivity.findMany({
      where: { userId },
      select: { type: true, createdAt: true },
    });

    const aiStats = {
      SUMMARY: 0,
      EXPERIENCE: 0,
      PROJECT: 0,
      SKILLS: 0,
      TAILOR: 0,
      ATS_INSIGHTS: 0,
    };

    aiActivities.forEach((act) => {
      if (aiStats[act.type] !== undefined) {
        aiStats[act.type]++;
      }
    });

    // 5. Historical scores for the trend chart
    const scoreHistory = await prisma.aTSAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: {
        score: true,
        createdAt: true,
      },
    });

    // 6. Recent Activity dynamically merged
    // Fetch last 10 resumes, 10 scans, 10 AI operations, and 10 versions/restores
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { title: true, createdAt: true },
    });

    const analyses = await prisma.aTSAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { score: true, createdAt: true, resume: { select: { title: true } } },
    });

    const recentAi = await prisma.aIActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { type: true, createdAt: true },
    });

    const recentVersions = await prisma.resumeVersion.findMany({
      where: { resumeId: { in: resumeIds } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { versionNumber: true, reason: true, createdAt: true, resume: { select: { title: true } } },
    });

    const activities = [];

    // Map Resumes
    resumes.forEach((r) => {
      const isDuplicate = r.title.endsWith('(Copy)');
      activities.push({
        type: isDuplicate ? 'RESUME_DUPLICATE' : 'RESUME_CREATE',
        message: isDuplicate ? `Duplicated Resume "${r.title.replace(' (Copy)', '')}"` : `Created Resume "${r.title}"`,
        timestamp: r.createdAt,
      });
    });

    // Map ATS scans
    analyses.forEach((a) => {
      const title = a.resume?.title || 'a resume';
      activities.push({
        type: 'ATS_SCAN',
        message: `Ran ATS Analysis for "${title}" (${a.score}%)`,
        timestamp: a.createdAt,
      });
    });

    // Map AI activities
    const aiTypeLabels = {
      SUMMARY: 'Generated Summary',
      EXPERIENCE: 'Enhanced Experience',
      PROJECT: 'Enhanced Project',
      SKILLS: 'Suggested Skills',
      TAILOR: 'Tailored Resume',
      ATS_INSIGHTS: 'Generated ATS Insights',
    };

    recentAi.forEach((ai) => {
      activities.push({
        type: `AI_${ai.type}`,
        message: aiTypeLabels[ai.type] || 'Performed AI Generation',
        timestamp: ai.createdAt,
      });
    });

    // Map version snapshot / restores
    recentVersions.forEach((v) => {
      const isRestore = v.reason?.startsWith('Restored Version');
      activities.push({
        type: isRestore ? 'VERSION_RESTORE' : 'VERSION_CREATE',
        message: isRestore
          ? `Restored Version ${v.reason.split(' ').pop()} on "${v.resume?.title || 'Resume'}"`
          : `Created Version ${v.versionNumber} for "${v.resume?.title || 'Resume'}" (${v.reason})`,
        timestamp: v.createdAt,
      });
    });

    // Sort combined feed descending and select top 8
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const recentActivity = activities.slice(0, 8);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalResumes,
          totalAnalyses,
          aiGenerations,
          averageAtsScore,
          bestAtsScore,
          tailoredResumesCount: aiStats.TAILOR,
          versionsCreated,
          aiAcceptanceRate,
        },
        aiStats,
        scoreHistory,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('[getDashboardStats]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics.',
    });
  }
};
