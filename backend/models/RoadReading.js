const mongoose = require('mongoose');

const roadReadingSchema = new mongoose.Schema({
  accX: { type: Number, required: true },
  accY: { type: Number, required: true },
  accZ: { type: Number, required: true },
  roadClass: { type: Number, enum: [0, 1, 2], required: true },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  location: { type: String, default: null },
  recordedAt: { type: Date, default: null },
  source: { type: String, default: 'Data Files/TotalData.csv' },
  demoLocation: { type: Boolean, default: false },
  routePointId: { type: String, default: null },
  routePointOrder: { type: Number, default: null },
  routePointKind: { type: String, enum: ['good_patch', 'rough_patch', 'breaker', null], default: null },
  coordinateStatus: { type: String, enum: ['surveyed', 'fabricated', null], default: null },
  coordinateSource: { type: String, default: null },
}, { timestamps: true });

mongoose.model('RoadReading', roadReadingSchema);
