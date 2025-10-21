const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/logController');
const authMiddleware = require('../middleware/authMiddleware');

// Only admins can fetch logs
router.get('/', authMiddleware.verifyToken, authMiddleware.isAdmin, getLogs);

module.exports = router;
