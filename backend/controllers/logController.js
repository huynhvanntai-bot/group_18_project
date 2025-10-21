const Log = require('../models/Log');
const User = require('../models/User');

// GET /api/logs?page=1&limit=20&action=login_failed
const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const action = req.query.action;

    const filter = {};
    if (action) filter.action = action;

    const total = await Log.countDocuments(filter);
    const logs = await Log.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // optional: populate user basic info
    const userIds = [...new Set(logs.filter(l => l.userId).map(l => l.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).select('ten email').lean();
    const usersMap = users.reduce((acc, u) => ({ ...acc, [u._id]: u }), {});

    const items = logs.map(l => ({
      ...l,
      user: l.userId ? usersMap[l.userId] || null : null,
    }));

    res.json({ page, limit, total, items });
  } catch (err) {
    console.error('Error fetching logs', err);
    res.status(500).json({ message: 'Lỗi khi lấy logs' });
  }
};

module.exports = { getLogs };
