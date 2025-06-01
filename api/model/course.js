const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  professorId: { type: String, required: true } // Add professorId to link courses to professors
});

module.exports = mongoose.model('Course', courseSchema);