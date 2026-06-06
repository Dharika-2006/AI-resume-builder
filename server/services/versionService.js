import prisma from '../config/prisma.js';
import { resumeIncludes } from '../utils/resumeIncludes.js';

/**
 * createVersionSnapshot
 * - Saves a snapshot of the current state of a resume
 * - Limits saved snapshots to the latest 50 versions per resume, deleting the oldest if exceeded
 */
export async function createVersionSnapshot(resumeId, { reason, createdByAI = false, customSnapshot = null }) {
  // 1. Get snapshot data (either custom passed in or query current database state)
  let snapshotData = customSnapshot;
  if (!snapshotData) {
    const currentResume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: resumeIncludes,
    });
    if (!currentResume) {
      throw new Error('Resume not found to snapshot.');
    }
    snapshotData = currentResume;
  }

  // 2. Count existing versions
  const count = await prisma.resumeVersion.count({
    where: { resumeId }
  });

  // 3. Delete oldest if version limit (50) is exceeded
  if (count >= 50) {
    const oldestVersion = await prisma.resumeVersion.findFirst({
      where: { resumeId },
      orderBy: { versionNumber: 'asc' }
    });
    if (oldestVersion) {
      await prisma.resumeVersion.delete({
        where: { id: oldestVersion.id }
      });
    }
  }

  // 4. Calculate next version number
  const latestVersion = await prisma.resumeVersion.findFirst({
    where: { resumeId },
    orderBy: { versionNumber: 'desc' }
  });
  const nextVersionNum = latestVersion ? latestVersion.versionNumber + 1 : 1;

  // 5. Save the snapshot
  return await prisma.resumeVersion.create({
    data: {
      resumeId,
      versionNumber: nextVersionNum,
      reason: reason || 'Manual Snapshot',
      createdByAI,
      snapshot: snapshotData,
    }
  });
}

/**
 * getVersionHistory
 * - Retrieves full snapshot history, ordered by versionNumber descending
 */
export async function getVersionHistory(resumeId) {
  return await prisma.resumeVersion.findMany({
    where: { resumeId },
    orderBy: { versionNumber: 'desc' },
  });
}

/**
 * restoreVersion
 * - Replaces current resume fields and nested lists with snapshot data
 * - Creates a restore safety snapshot of the new state
 */
export async function restoreVersion(resumeId, versionId) {
  const targetVersion = await prisma.resumeVersion.findUnique({
    where: { id: versionId }
  });
  if (!targetVersion) {
    throw new Error('Version snapshot not found.');
  }

  // Preserve resume ownership validation for the version snapshot
  if (targetVersion.resumeId !== resumeId) {
    throw new Error('Access denied. Version snapshot does not belong to this resume.');
  }

  const snapshot = typeof targetVersion.snapshot === 'string'
    ? JSON.parse(targetVersion.snapshot)
    : targetVersion.snapshot;

  // Perform atomic database update to overwrite nested sections
  // Specifying timeout options (timeout: 30000ms) to prevent transaction timeout errors on slower cloud DBs like Neon
  const restoredResume = await prisma.$transaction(async (tx) => {
    // 1. Delete nested items
    await tx.education.deleteMany({ where: { resumeId } });
    await tx.experience.deleteMany({ where: { resumeId } });
    await tx.project.deleteMany({ where: { resumeId } });
    await tx.skill.deleteMany({ where: { resumeId } });
    await tx.certification.deleteMany({ where: { resumeId } });

    // 2. Update main resume and upsert personalInfo + insert new nested arrays
    return await tx.resume.update({
      where: { id: resumeId },
      data: {
        title: snapshot.title,
        template: snapshot.template,
        colorTheme: snapshot.colorTheme,
        description: snapshot.description,
        personalInfo: snapshot.personalInfo ? {
          upsert: {
            create: {
              name: snapshot.personalInfo.name,
              email: snapshot.personalInfo.email,
              phone: snapshot.personalInfo.phone,
              location: snapshot.personalInfo.location,
              linkedin: snapshot.personalInfo.linkedin,
              github: snapshot.personalInfo.github,
              portfolio: snapshot.personalInfo.portfolio,
              summary: snapshot.personalInfo.summary,
            },
            update: {
              name: snapshot.personalInfo.name,
              email: snapshot.personalInfo.email,
              phone: snapshot.personalInfo.phone,
              location: snapshot.personalInfo.location,
              linkedin: snapshot.personalInfo.linkedin,
              github: snapshot.personalInfo.github,
              portfolio: snapshot.personalInfo.portfolio,
              summary: snapshot.personalInfo.summary,
            }
          }
        } : undefined,
        education: snapshot.education && Array.isArray(snapshot.education) ? {
          create: snapshot.education.map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            year: edu.year,
            cgpa: edu.cgpa,
          }))
        } : undefined,
        experience: snapshot.experience && Array.isArray(snapshot.experience) ? {
          create: snapshot.experience.map((exp) => ({
            role: exp.role,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
          }))
        } : undefined,
        projects: snapshot.projects && Array.isArray(snapshot.projects) ? {
          create: snapshot.projects.map((proj) => ({
            name: proj.name,
            techStack: proj.techStack,
            description: proj.description,
            githubLink: proj.githubLink,
            liveLink: proj.liveLink,
          }))
        } : undefined,
        skills: snapshot.skills && Array.isArray(snapshot.skills) ? {
          create: snapshot.skills.map((skill) => ({
            name: skill.name,
          }))
        } : undefined,
        certifications: snapshot.certifications && Array.isArray(snapshot.certifications) ? {
          create: snapshot.certifications.map((cert) => ({
            name: cert.name,
            issuer: cert.issuer,
            year: cert.year,
          }))
        } : undefined,
      },
      include: resumeIncludes,
    });
  }, {
    maxWait: 15000,
    timeout: 30000,
  });

  // 3. Create a restore safety version snapshot of the newly restored state
  await createVersionSnapshot(resumeId, {
    reason: `Restored Version ${targetVersion.versionNumber}`,
    createdByAI: false,
    customSnapshot: restoredResume,
  });

  return restoredResume;
}

/**
 * compareVersions
 * - Returns snapshots for left and right targets
 */
export async function compareVersions(resumeId, leftId, rightId) {
  const getSnapshot = async (idOrCurrent) => {
    if (idOrCurrent === 'current') {
      const current = await prisma.resume.findUnique({
        where: { id: resumeId },
        include: resumeIncludes,
      });
      if (!current) throw new Error('Current resume not found.');
      return current;
    }

    const version = await prisma.resumeVersion.findUnique({
      where: { id: idOrCurrent }
    });
    if (!version) throw new Error(`Version ID ${idOrCurrent} not found.`);
    return typeof version.snapshot === 'string' ? JSON.parse(version.snapshot) : version.snapshot;
  };

  const leftSnapshot = await getSnapshot(leftId);
  const rightSnapshot = await getSnapshot(rightId);

  return {
    left: leftSnapshot,
    right: rightSnapshot,
  };
}
