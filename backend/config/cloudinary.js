// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const path = require('path');

// Ensure we load the backend .env file explicitly (so scripts run from repo root still
// pick up backend env vars). This avoids missing CLOUDINARY_* when node is executed
// from the repository root or other working directories.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
