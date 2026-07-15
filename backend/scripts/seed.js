const connectDatabase = require('../db');
require('../models/Admin');
require('../models/RoadReading');
require('../models/Feedback');
const { ensureDemoData } = require('../seed');

async function seed() {
  await connectDatabase();
  await ensureDemoData();
  console.log('Database is ready');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
