// Simple test script to insert and query logs directly using Mongoose
require('dotenv').config();
const mongoose = require('mongoose');
const Log = require('./models/Log');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // insert a test log
  const l = new Log({ action: 'test_insert', ip: '127.0.0.1', meta: { note: 'from test_logs' } });
  await l.save();
  console.log('Inserted log:', l._id);

  // query last 5 logs
  const recent = await Log.find().sort({ createdAt: -1 }).limit(5).lean();
  console.log('Recent logs:', recent);

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
