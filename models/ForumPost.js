const mongoose = require('mongoose');

const ForumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumCategory', required: true },
  created_at: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('ForumPost', ForumPostSchema);