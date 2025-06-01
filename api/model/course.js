const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }
});

module.exports = mongoose.model('Course', courseSchema);