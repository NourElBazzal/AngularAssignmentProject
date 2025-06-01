const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const Professor = require('../model/professor');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;
    const role = req.body.role || localStorage.getItem('role'); // Temporary, replace with JWT

    let userModel, updatedUser;
    if (role === 'student') {
      userModel = Student;
    } else if (role === 'professor' || role === 'admin') {
      userModel = Professor;
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updateData = {};
    console.log('Received data:', { name, password, file: req.file ? req.file.filename : null }); // Debug log
    if (name) updateData[nameField(role)] = name; // Only update if name is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }
    if (req.file) {
      console.log('File received:', req.file.filename); // Debug log
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    updatedUser = await userModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

function nameField(role) {
  return role === 'student' ? 'fullName' : 'name';
}

module.exports = router;