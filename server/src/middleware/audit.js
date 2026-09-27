const AuditLog = require('../models/AuditLog');

const logAudit = async ({ user, userRole, action, targetType, targetId, ipAddress = '', metadata = {} }) => {
  try {
    await AuditLog.create({
      user: user?._id || user,
      userRole: userRole || user?.role || 'system',
      action,
      targetType,
      targetId,
      ipAddress,
      metadata,
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record audit log:', err.message);
  }
};

module.exports = { logAudit };
