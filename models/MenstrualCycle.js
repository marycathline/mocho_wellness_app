const mongoose = require('mongoose');

const MenstrualCycleSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, default: null },
  flow_intensity: String
});

module.exports = mongoose.model('MenstrualCycle', MenstrualCycleSchema);