const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../model/student');
const Professor = require('../model/professor');
const Assignment = require('../model/assignment');
const Course = require('../model/course');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Multer config for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET one student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET student courses with professors and assignments
router.get('/:id/courses', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id }).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const courseIds = student.coursesTaken.map(id => new mongoose.Types.ObjectId(id));
    const courses = await Course.find({ _id: { $in: courseIds } }).lean();

    const studentAssignments = await Assignment.find({
      _id: { $in: student.assignments.map(id => new mongoose.Types.ObjectId(id)) }
    }, 'id name dueDate submitted grade courseId').lean();

    const courseDetails = await Promise.all(courses.map(async (course) => {
      const professors = await Professor.find(
        { courseIds: { $in: [course._id.toString()] } },
        'id name image'
      ).lean();

      const assignments = studentAssignments.filter(assignment =>
        assignment.courseId && assignment.courseId.toString() === course._id.toString()
      );

      return {
        _id: course._id.toString(),
        name: course.name,
        image: course.image || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(course.name),
        professors,
        assignments
      };
    }));

    res.json(courseDetails);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ PUT student update with image & password
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, role } = req.body;
    const userModel = role === 'professor' ? Professor : Student;

    const updateData = {};
    if (name) updateData[role === 'student' ? 'fullName' : 'name'] = name;
    if (password) updateData.password = await bcrypt.hash(password, saltRounds);
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await userModel.findOneAndUpdate({ id }, { $set: updateData }, { new: true });

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Student updated', user: updated });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE student
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
