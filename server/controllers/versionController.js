import prisma from '../config/prisma.js';
import * as versionService from '../services/versionService.js';

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

export const handleCreateSnapshot = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, createdByAI } = req.body;

    const isOwner = await verifyResumeOwnership(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const version = await versionService.createVersionSnapshot(id, {
      reason: reason || 'Manual Snapshot',
      createdByAI: !!createdByAI,
    });

    return res.status(201).json({
      success: true,
      message: 'Resume version snapshot created successfully.',
      data: version,
    });
  } catch (error) {
    console.error('[handleCreateSnapshot] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while creating version snapshot.',
    });
  }
};

export const handleGetHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const isOwner = await verifyResumeOwnership(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const history = await versionService.getVersionHistory(id);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('[handleGetHistory] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching version history.',
    });
  }
};

export const handleGetVersionDetails = async (req, res) => {
  try {
    const { id, versionId } = req.params;

    const isOwner = await verifyResumeOwnership(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const version = await prisma.resumeVersion.findFirst({
      where: { id: versionId, resumeId: id }
    });

    if (!version) {
      return res.status(404).json({
        success: false,
        message: 'Version snapshot not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: version,
    });
  } catch (error) {
    console.error('[handleGetVersionDetails] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching version details.',
    });
  }
};

export const handleRestoreVersion = async (req, res) => {
  try {
    const { id, versionId } = req.params;

    const isOwner = await verifyResumeOwnership(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const restoredResume = await versionService.restoreVersion(id, versionId);

    return res.status(200).json({
      success: true,
      message: 'Resume restored to version snapshot successfully.',
      data: restoredResume,
    });
  } catch (error) {
    console.error('[handleRestoreVersion] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while restoring version.',
    });
  }
};

export const handleCompareVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const { left, right } = req.query;

    if (!left || !right) {
      return res.status(400).json({
        success: false,
        message: 'Both left and right query parameters are required for comparison.',
      });
    }

    const isOwner = await verifyResumeOwnership(id, req.user.id);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resume.',
      });
    }

    const comparison = await versionService.compareVersions(id, left, right);

    return res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    console.error('[handleCompareVersions] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during version comparison.',
    });
  }
};
