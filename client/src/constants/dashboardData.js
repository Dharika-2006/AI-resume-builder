/**
 * Dashboard Constants & Mock Data Configuration
 * - Houses workspace statistical counters
 * - Details routing pathways, description text, and styling attributes for Quick Actions
 * - Decouples data logic from presentation to simplify future API integration
 */

export const dashboardStats = {
  resumes: 3,
  analyses: 5,
  generations: 12,
};

export const quickActions = [
  {
    title: 'Create New Resume',
    description:
      'Design a professional resume in minutes using AI-tailored text recommendations and modern layout designs.',
    badgeText: 'Create',
    badgeType: 'primary',
    linkTo: '/builder/new',
    actionText: 'Build Resume',
    iconName: 'PlusCircle',
  },
  {
    title: 'My Resumes',
    description:
      'Manage, edit, duplicate, or export your saved resumes to high-fidelity PDF formats anytime.',
    badgeText: `${dashboardStats.resumes} Saved`,
    badgeType: 'success',
    linkTo: '/resumes',
    actionText: 'View Gallery',
    iconName: 'FileText',
  },
  {
    title: 'ATS Analyzer',
    description:
      'Upload your resume alongside a job description to extract match percentages and detailed keyword improvements.',
    badgeText: 'AI Powered',
    badgeType: 'accent',
    linkTo: '/ats',
    actionText: 'Scan Score',
    iconName: 'Cpu',
  },
  {
    title: 'Profile Settings',
    description:
      'Adjust your user preferences, career levels, and core fields for automated resume pre-filling.',
    badgeText: 'Account',
    badgeType: 'default',
    linkTo: '/profile',
    actionText: 'Edit Info',
    iconName: 'UserCog',
  },
];
