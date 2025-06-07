
const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  response: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.models.ChatHistory || mongoose.model('ChatHistory', ChatHistorySchema);