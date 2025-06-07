const mongoose = require('mongoose');

const ForumCommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumComment', default: null },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumComment', ForumCommentSchema);