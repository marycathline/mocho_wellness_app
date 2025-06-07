const mongoose = require('mongoose');

const CycleDataSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  flow_level: String,
  pain_level: Number,
  cramping: Boolean,
  headache: Boolean,
  breast_tenderness: Boolean,
  bloating: Boolean,
  mood: String,
  energy_level: Number,
  stress_level: Number,
  notes: String,
});

module.exports = mongoose.model('CycleData', CycleDataSchema);