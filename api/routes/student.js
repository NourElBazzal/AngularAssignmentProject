const express = require('express');
const router = express.Router();
const Student = require('../model/student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Student.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
