const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/road-health-map';

async function connectDatabase() {
  await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
  console.log(`Connected to MongoDB (${mongoose.connection.name})`);
}

module.exports = connectDatabase;
