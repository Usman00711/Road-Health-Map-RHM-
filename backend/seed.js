const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');
const RoadReading = mongoose.model('RoadReading');
const Feedback = mongoose.model('Feedback');
const sourceName = 'Data Files/TotalData.csv';
const routePoints = [
  { order: 1, roadClass: 2, latitude: 33.700528, longitude: 72.972389, kind: 'breaker', location: 'E-11/2 - Speed breaker 1', status: 'surveyed' },
  { order: 2, roadClass: 0, latitude: 33.7008815, longitude: 72.972117, kind: 'good_patch', location: 'E-11/2 - Good road segment 1', status: 'fabricated' },
  { order: 3, roadClass: 2, latitude: 33.701235, longitude: 72.971845, kind: 'breaker', location: 'E-11/2 - Breaker 2', status: 'surveyed' },
  { order: 4, roadClass: 0, latitude: 33.701601, longitude: 72.9715825, kind: 'good_patch', location: 'E-11/2 - Good road segment 2', status: 'fabricated' },
  { order: 5, roadClass: 1, latitude: 33.701967, longitude: 72.971320, kind: 'rough_patch', location: 'E-11/2 - Rough patch 1', status: 'surveyed' },
  { order: 6, roadClass: 0, latitude: 33.7022385, longitude: 72.971765, kind: 'good_patch', location: 'E-11/2 - Good road segment 3', status: 'fabricated' },
  { order: 7, roadClass: 1, latitude: 33.702510, longitude: 72.972210, kind: 'rough_patch', location: 'E-11/2 - Rough patch 2', status: 'surveyed' },
  { order: 8, roadClass: 0, latitude: 33.702938, longitude: 72.9730635, kind: 'good_patch', location: 'E-11/2 - Good road segment 4', status: 'fabricated' },
  { order: 9, roadClass: 1, latitude: 33.703366, longitude: 72.973917, kind: 'rough_patch', location: 'E-11/2 - Rough patch 3', status: 'surveyed' },
  { order: 10, roadClass: 0, latitude: 33.7039405, longitude: 72.9749835, kind: 'good_patch', location: 'E-11/2 - Good road segment 5', status: 'fabricated' },
  { order: 11, roadClass: 2, latitude: 33.704515, longitude: 72.976050, kind: 'breaker', location: 'E-11/2 - Breaker 3', status: 'surveyed' },
];

function loadCompleteDataset() {
  const csvPath = path.resolve(__dirname, '../data/TotalData.csv');
  return fs.readFileSync(csvPath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((row) => {
      const [accX, accY, accZ, rawClass] = row.split(',').map(Number);
      return {
        accX,
        accY,
        accZ,
        roadClass: Math.round(rawClass),
        latitude: null,
        longitude: null,
        location: null,
        recordedAt: null,
        source: sourceName,
        demoLocation: false,
      };
    })
    .filter((row) => [row.accX, row.accY, row.accZ, row.roadClass].every(Number.isFinite));
}

async function applyE112RoutePoints() {
  const existing = await RoadReading.countDocuments({ routePointId: /^e112-route-/ });
  if (existing === routePoints.length) return;

  await RoadReading.updateMany(
    { routePointId: /^e112-route-/ },
    {
      $set: { latitude: null, longitude: null, location: null },
      $unset: {
        routePointId: '', routePointOrder: '', routePointKind: '',
        coordinateStatus: '', coordinateSource: '',
      },
    },
  );

  for (const roadClass of [0, 1, 2]) {
    const points = routePoints.filter((point) => point.roadClass === roadClass);
    const readings = await RoadReading.find({
      source: sourceName,
      roadClass,
      latitude: null,
      longitude: null,
    }).sort({ _id: 1 }).limit(points.length).select('_id').lean();
    if (readings.length !== points.length) throw new Error(`Not enough class ${roadClass} readings for route points`);

    await RoadReading.bulkWrite(readings.map((reading, index) => {
      const point = points[index];
      return {
        updateOne: {
          filter: { _id: reading._id },
          update: {
            $set: {
              latitude: point.latitude,
              longitude: point.longitude,
              location: point.location,
              routePointId: `e112-route-${point.order}`,
              routePointOrder: point.order,
              routePointKind: point.kind,
              coordinateStatus: point.status,
              coordinateSource: point.status === 'surveyed'
                ? 'User-provided field GPS'
                : 'Midpoint interpolated between user-provided GPS observations',
            },
          },
        },
      };
    }), { ordered: true });
  }
}

async function ensureDemoData() {
  if (await Admin.countDocuments() === 0) {
    await Admin.create({
      email: process.env.DEMO_ADMIN_EMAIL || 'admin@rhm.local',
      password: process.env.DEMO_ADMIN_PASSWORD || 'RoadHealth123!',
    });
    console.log('Created local administrator');
  }

  const readingCount = await RoadReading.countDocuments();
  const fakeReadingCount = await RoadReading.countDocuments({ demoLocation: true });
  const completeImportCount = await RoadReading.countDocuments({ source: sourceName, demoLocation: false });
  if (fakeReadingCount > 0 || readingCount === 0 || completeImportCount !== 10023) {
    await RoadReading.deleteMany({});
    const rows = loadCompleteDataset();
    await RoadReading.insertMany(rows, { ordered: false });
    console.log(`Imported ${rows.length} real classified CSV rows without GPS data`);
  }

  await applyE112RoutePoints();

  const portfolioFeedback = [
    {
      name: 'Ayesha Khan',
      email: 'ayesha.khan@example.com',
      message: 'The speed breaker near E-11/2 is difficult to see after sunset. Reflective paint would make the approach much safer.',
      rating: 4,
      status: 'new',
    },
    {
      name: 'Hamza Ali',
      email: 'hamza.ali@example.com',
      message: 'The rough patch beside the service road has improved since the last repair. The route feels noticeably smoother now.',
      rating: 5,
      status: 'reviewed',
    },
    {
      name: 'Sara Ahmed',
      email: 'sara.ahmed@example.com',
      message: 'There is recurring surface damage close to the E-11/2 turn. Please schedule another inspection before the next rainfall.',
      rating: 3,
      status: 'new',
    },
    {
      name: 'Bilal Raza',
      email: 'bilal.raza@example.com',
      message: 'The road condition map matches the problem areas I encounter on my daily commute and makes reporting much clearer.',
      rating: 5,
      status: 'reviewed',
    },
    {
      name: 'Mariam Hassan',
      email: 'mariam.hassan@example.com',
      message: 'Please add warning signs before the two closely spaced breakers. Drivers unfamiliar with the area brake very suddenly.',
      rating: 4,
      status: 'new',
    },
  ];

  await Promise.all(portfolioFeedback.map(({ email, ...feedback }) => Feedback.updateOne(
    { email },
    { $set: { ...feedback, email } },
    { upsert: true },
  )));
}

module.exports = { ensureDemoData };
