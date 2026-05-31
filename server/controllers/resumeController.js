import prisma from '../config/prisma.js';
import { resumeIncludes } from '../utils/resumeIncludes.js';

// ─── Helpers ────────────────────────────────────────────────

/**
 * Basic email format validation helper
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ─── Controllers ────────────────────────────────────────────

/**
 * POST /api/resumes
 * Create a new resume with fully nested sections.
 */
export const createResume = async (req, res) => {
  try {
    const {
      title,
      template,
      description,
      personalInfo,
      education,
      experience,
      projects,
      skills,
      certifications,
    } = req.body;

    // ── Input Validation ──
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resume title is required.',
      });
    }

    if (template && !['MODERN', 'CORPORATE', 'MINIMAL'].includes(template)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template type. Allowed types: MODERN, CORPORATE, MINIMAL.',
      });
    }

    // Validate nested personalInfo if provided
    if (personalInfo) {
      if (!personalInfo.name || !personalInfo.name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Personal Info name is required.',
        });
      }
      if (!personalInfo.email || !personalInfo.email.trim() || !isValidEmail(personalInfo.email)) {
        return res.status(400).json({
          success: false,
          message: 'A valid email is required inside Personal Info.',
        });
      }
    }

    // ── Database Entry ──
    const newResume = await prisma.resume.create({
      data: {
        title: title.trim(),
        template: template || 'MODERN',
        description: description?.trim() || null,
        userId: req.user.id,
        // Nested creations
        personalInfo: personalInfo ? {
          create: {
            name: personalInfo.name.trim(),
            email: personalInfo.email.toLowerCase().trim(),
            phone: personalInfo.phone?.trim() || null,
            location: personalInfo.location?.trim() || null,
            linkedin: personalInfo.linkedin?.trim() || null,
            github: personalInfo.github?.trim() || null,
            portfolio: personalInfo.portfolio?.trim() || null,
            summary: personalInfo.summary?.trim() || null,
          },
        } : undefined,
        education: education && Array.isArray(education) ? {
          create: education.map((edu) => ({
            degree: edu.degree?.trim() || 'Degree',
            institution: edu.institution?.trim() || 'Institution',
            year: edu.year?.toString() || '',
            cgpa: edu.cgpa?.toString() || null,
          })),
        } : undefined,
        experience: experience && Array.isArray(experience) ? {
          create: experience.map((exp) => ({
            role: exp.role?.trim() || 'Role',
            company: exp.company?.trim() || 'Company',
            startDate: exp.startDate?.trim() || '',
            endDate: exp.endDate?.trim() || null,
            description: exp.description?.trim() || '',
          })),
        } : undefined,
        projects: projects && Array.isArray(projects) ? {
          create: projects.map((proj) => ({
            name: proj.name?.trim() || 'Project Name',
            techStack: proj.techStack?.trim() || '',
            description: proj.description?.trim() || '',
            githubLink: proj.githubLink?.trim() || null,
            liveLink: proj.liveLink?.trim() || null,
          })),
        } : undefined,
        skills: skills && Array.isArray(skills) ? {
          create: skills.map((skill) => ({
            name: skill.name?.trim() || 'Skill',
          })),
        } : undefined,
        certifications: certifications && Array.isArray(certifications) ? {
          create: certifications.map((cert) => ({
            name: cert.name?.trim() || 'Certification',
            issuer: cert.issuer?.trim() || 'Issuer',
            year: cert.year?.toString() || '',
          })),
        } : undefined,
      },
      include: resumeIncludes,
    });

    return res.status(201).json({
      success: true,
      message: 'Resume created successfully.',
      data: newResume,
    });
  } catch (error) {
    console.error('[createResume]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating resume.',
    });
  }
};

/**
 * GET /api/resumes
 * Retrieve lightweight summary of all resumes owned by the authenticated user.
 */
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        id: true,
        title: true,
        template: true,
        updatedAt: true,
        description: true,
        _count: {
          select: {
            education: true,
            experience: true,
            projects: true,
            skills: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Resumes retrieved successfully.',
      data: resumes,
    });
  } catch (error) {
    console.error('[getMyResumes]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching resumes list.',
    });
  }
};

/**
 * GET /api/resumes/:id
 * Retrieve a specific resume by ID (enforcing strict user ownership).
 */
export const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Direct Database level verification of ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: id,
        userId: req.user.id,
      },
      include: resumeIncludes,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume retrieved successfully.',
      data: resume,
    });
  } catch (error) {
    console.error('[getResumeById]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching resume details.',
    });
  }
};

/**
 * PUT /api/resumes/:id
 * Update a specific resume (enforcing strict user ownership).
 */
export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      template,
      description,
      personalInfo,
      education,
      experience,
      projects,
      skills,
      certifications,
    } = req.body;

    // ── Input Validation ──
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resume title is required.',
      });
    }

    if (template && !['MODERN', 'CORPORATE', 'MINIMAL'].includes(template)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template type. Allowed types: MODERN, CORPORATE, MINIMAL.',
      });
    }

    if (personalInfo) {
      if (!personalInfo.name || !personalInfo.name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Personal Info name is required.',
        });
      }
      if (!personalInfo.email || !personalInfo.email.trim() || !isValidEmail(personalInfo.email)) {
        return res.status(400).json({
          success: false,
          message: 'A valid email is required inside Personal Info.',
        });
      }
    }

    // ── Direct Database Verification of Ownership ──
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    // ── Atomic Update Operations ──
    // Future optimization: Use IDs and differential updates instead of full recreation.
    const updatedResume = await prisma.resume.update({
      where: {
        id: id,
      },
      data: {
        title: title.trim(),
        template: template || 'MODERN',
        description: description?.trim() || null,
        // Upsert 1:1 Personal Info
        personalInfo: personalInfo ? {
          upsert: {
            create: {
              name: personalInfo.name.trim(),
              email: personalInfo.email.toLowerCase().trim(),
              phone: personalInfo.phone?.trim() || null,
              location: personalInfo.location?.trim() || null,
              linkedin: personalInfo.linkedin?.trim() || null,
              github: personalInfo.github?.trim() || null,
              portfolio: personalInfo.portfolio?.trim() || null,
              summary: personalInfo.summary?.trim() || null,
            },
            update: {
              name: personalInfo.name.trim(),
              email: personalInfo.email.toLowerCase().trim(),
              phone: personalInfo.phone?.trim() || null,
              location: personalInfo.location?.trim() || null,
              linkedin: personalInfo.linkedin?.trim() || null,
              github: personalInfo.github?.trim() || null,
              portfolio: personalInfo.portfolio?.trim() || null,
              summary: personalInfo.summary?.trim() || null,
            },
          },
        } : undefined,
        // 1:M arrays use atomic clear-and-insert deleteMany + create pattern
        education: education && Array.isArray(education) ? {
          deleteMany: {},
          create: education.map((edu) => ({
            degree: edu.degree?.trim() || 'Degree',
            institution: edu.institution?.trim() || 'Institution',
            year: edu.year?.toString() || '',
            cgpa: edu.cgpa?.toString() || null,
          })),
        } : undefined,
        experience: experience && Array.isArray(experience) ? {
          deleteMany: {},
          create: experience.map((exp) => ({
            role: exp.role?.trim() || 'Role',
            company: exp.company?.trim() || 'Company',
            startDate: exp.startDate?.trim() || '',
            endDate: exp.endDate?.trim() || null,
            description: exp.description?.trim() || '',
          })),
        } : undefined,
        projects: projects && Array.isArray(projects) ? {
          deleteMany: {},
          create: projects.map((proj) => ({
            name: proj.name?.trim() || 'Project Name',
            techStack: proj.techStack?.trim() || '',
            description: proj.description?.trim() || '',
            githubLink: proj.githubLink?.trim() || null,
            liveLink: proj.liveLink?.trim() || null,
          })),
        } : undefined,
        skills: skills && Array.isArray(skills) ? {
          deleteMany: {},
          create: skills.map((skill) => ({
            name: skill.name?.trim() || 'Skill',
          })),
        } : undefined,
        certifications: certifications && Array.isArray(certifications) ? {
          deleteMany: {},
          create: certifications.map((cert) => ({
            name: cert.name?.trim() || 'Certification',
            issuer: cert.issuer?.trim() || 'Issuer',
            year: cert.year?.toString() || '',
          })),
        } : undefined,
      },
      include: resumeIncludes,
    });

    return res.status(200).json({
      success: true,
      message: 'Resume updated successfully.',
      data: updatedResume,
    });
  } catch (error) {
    console.error('[updateResume]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating resume.',
    });
  }
};

/**
 * DELETE /api/resumes/:id
 * Delete a specific resume (enforcing strict user ownership).
 */
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    // Direct Database level verification of ownership
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: id,
        userId: req.user.id,
      },
    });

    if (!existingResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found.',
      });
    }

    // Database relations are cascade-configured, deleting parent clears all child data
    await prisma.resume.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    console.error('[deleteResume]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting resume.',
    });
  }
};
