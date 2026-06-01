/**
 * Reusable Resume Processing Helpers
 * - Centralizes calculations, formatting, sorting, and cloning operations
 * - Keeps component views completely isolated from domain specific computation
 */

/**
 * Formats standard Prisma date strings beautifully into "Month Day, Year"
 */
export const formatResumeDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Sanitizes and clones deep nested resume structures by stripping primary IDs and metadata
 * to prepare an atomic copy creation payload.
 */
export const duplicateResumePayload = (resume) => {
  if (!resume) return {};

  const personalInfo = resume.personalInfo
    ? {
        name: resume.personalInfo.name,
        email: resume.personalInfo.email,
        phone: resume.personalInfo.phone,
        location: resume.personalInfo.location,
        linkedin: resume.personalInfo.linkedin,
        github: resume.personalInfo.github,
        portfolio: resume.personalInfo.portfolio,
        summary: resume.personalInfo.summary,
      }
    : undefined;

  const education = resume.education?.map((edu) => ({
    degree: edu.degree,
    institution: edu.institution,
    year: edu.year,
    cgpa: edu.cgpa,
  }));

  const experience = resume.experience?.map((exp) => ({
    role: exp.role,
    company: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
  }));

  const projects = resume.projects?.map((proj) => ({
    name: proj.name,
    techStack: proj.techStack,
    description: proj.description,
    githubLink: proj.githubLink,
    liveLink: proj.liveLink,
  }));

  const skills = resume.skills?.map((skill) => ({
    name: skill.name,
  }));

  const certifications = resume.certifications?.map((cert) => ({
    name: cert.name,
    issuer: cert.issuer,
    year: cert.year,
  }));

  return {
    title: `${resume.title} (Copy)`,
    template: resume.template,
    description: resume.description,
    personalInfo,
    education,
    experience,
    projects,
    skills,
    certifications,
  };
};

/**
 * Returns premium styling tailwind tags based on template type
 */
export const getTemplateColor = (template) => {
  switch (template) {
    case 'MODERN':
      return {
        bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        gradient: 'from-cyan-500 to-blue-500',
        text: 'text-cyan-400',
      };
    case 'CORPORATE':
      return {
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        gradient: 'from-blue-600 to-indigo-600',
        text: 'text-blue-400',
      };
    case 'MINIMAL':
      return {
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        gradient: 'from-emerald-500 to-teal-500',
        text: 'text-emerald-400',
      };
    default:
      return {
        bg: 'bg-slate-800 text-slate-300 border-slate-700/60',
        gradient: 'from-slate-600 to-slate-400',
        text: 'text-slate-300',
      };
  }
};

/**
 * Extracts and maps relation counts for preview text labels
 */
export const getResumePreview = (resume) => {
  return {
    educationCount: resume._count?.education || 0,
    experienceCount: resume._count?.experience || 0,
    projectCount: resume._count?.projects || 0,
  };
};

/**
 * Calculates dynamic profile completeness scores out of 100
 */
export const getCompletionPercentage = (resume) => {
  if (!resume) return 0;
  let score = 0;

  if (resume.title) score += 15;
  if (resume._count?.education && resume._count.education > 0) score += 20;
  if (resume._count?.experience && resume._count.experience > 0) score += 25;
  if (resume._count?.projects && resume._count.projects > 0) score += 20;
  if (resume._count?.skills && resume._count.skills > 0) score += 20;

  return Math.min(score, 100);
};

/**
 * Sorts array list of resumes dynamically
 */
export const sortResumes = (resumes, sortBy) => {
  if (!resumes || !Array.isArray(resumes)) return [];
  const items = [...resumes];

  switch (sortBy) {
    case 'newest':
      return items.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
    case 'oldest':
      return items.sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );
    case 'alphabetical':
      return items.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return items;
  }
};
