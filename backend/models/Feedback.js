const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  status: { type: String, enum: ['new', 'reviewed'], default: 'new' },
}, { timestamps: true });

mongoose.model('Feedback', feedbackSchema);
