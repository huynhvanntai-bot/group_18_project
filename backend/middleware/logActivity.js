const Log = require('../models/Log');

// Middleware: attach helper to req for logging
const logActivity = async (req, res, next) => {
  // Provide a convenience function on req
  req.logActivity = async (userId, action, meta = {}) => {
    try {
      const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
      const log = new Log({ userId, action, ip, meta });
      await log.save();
    } catch (err) {
      // don't block main flow
      console.error('Failed to write activity log:', err.message);
    }
  };

  next();
};

module.exports = logActivity;
