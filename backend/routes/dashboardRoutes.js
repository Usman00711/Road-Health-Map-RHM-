const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const RoadReading = mongoose.model('RoadReading');
const Feedback = mongoose.model('Feedback');

const conditionNames = ['Good', 'Average', 'Poor'];

router.get('/overview', async (req, res) => {
  const [readings, feedbacks] = await Promise.all([
    RoadReading.find().sort({ recordedAt: 1 }).lean(),
    Feedback.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const counts = [0, 0, 0];
  readings.forEach((reading) => { counts[reading.roadClass] += 1; });
  const total = readings.length || 1;
  const byClass = [0, 1, 2].map((roadClass) => readings.filter((reading) => reading.roadClass === roadClass));
  const representative = [];
  for (let index = 0; index < 12; index += 1) {
    const roadClass = index % 3;
    const classRows = byClass[roadClass];
    const position = Math.floor((index / 12) * classRows.length);
    if (classRows[position]) representative.push(classRows[position]);
  }
  const trend = [];
  for (let index = 0; index < 36; index += 1) {
    const roadClass = index % 3;
    const classRows = byClass[roadClass];
    const position = Math.floor((index / 36) * classRows.length);
    if (classRows[position]) trend.push(classRows[position]);
  }
  const mapPoints = readings.filter((reading) => (
    Number.isFinite(reading.latitude) && Number.isFinite(reading.longitude)
  )).sort((a, b) => (a.routePointOrder || 0) - (b.routePointOrder || 0));
  res.json({
    summary: {
      totalReadings: readings.length,
      healthyPercent: Math.round((counts[0] / total) * 100),
      attentionRequired: counts[2],
      locationsCovered: new Set(mapPoints.map((reading) => (
        reading.location || `${reading.latitude},${reading.longitude}`
      ))).size,
      mappedReadings: mapPoints.length,
    },
    distribution: counts.map((count, index) => ({
      name: conditionNames[index],
      value: count,
      percent: Math.round((count / total) * 100),
    })),
    trend: trend.map((reading, index) => ({
      sample: index + 1,
      accX: Number(reading.accX.toFixed(2)),
      accY: Number(reading.accY.toFixed(2)),
      accZ: Number(reading.accZ.toFixed(2)),
    })),
    readings: representative,
    mapPoints,
    feedbacks,
  });
});

module.exports = router;
