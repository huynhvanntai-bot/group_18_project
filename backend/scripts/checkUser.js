const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const User = require('../models/User');

const id = process.argv[2];
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const u = await User.findById(id);
    if (!u) {
      console.log('NOT FOUND');
    } else {
      console.log('ten:', u.ten);
      console.log('user:', u.toObject());
    }
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
