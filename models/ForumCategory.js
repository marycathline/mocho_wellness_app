const mongoose = require('mongoose');

const ForumCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
});

module.exports = mongoose.model('ForumCategory', ForumCategorySchema);