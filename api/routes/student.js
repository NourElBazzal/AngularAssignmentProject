const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../model/student');
const Professor = require('../model/professor');
const Assignment = require('../model/assignment');
const Course = require('../model/course'); 

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

// Get student's courses with professors and assignments
router.get('/:id/courses', async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    console.log('Student:', student); // Debug student data

    // Convert coursesTaken strings to ObjectIds
    const courseIds = student.coursesTaken.map(id => new mongoose.Types.ObjectId(id));
    console.log('Course IDs:', courseIds);

    // Fetch courses
    const courses = await Course.find({ _id: { $in: courseIds } }).lean();
    console.log('Courses:', courses);

    // Fetch all assignments for the student
    const studentAssignments = await Assignment.find({ _id: { $in: student.assignments } }, 'id name dueDate submitted grade courseId').lean();
    console.log('Student Assignments:', studentAssignments);

    // Fetch professors and assignments for each course
    const courseDetails = await Promise.all(courses.map(async (course) => {
      // Find professors teaching this course
      const professors = await Professor.find(
        { courseIds: { $in: [course._id.toString()] } },
        'id name image'
      ).lean();
      console.log(`Professors for course ${course._id}:`, professors);

      // Filter assignments for this course
      const assignments = studentAssignments.filter(assignment => 
        assignment.courseId && assignment.courseId.toString() === course._id.toString()
      );
      console.log(`Assignments for course ${course._id}:`, assignments);

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
