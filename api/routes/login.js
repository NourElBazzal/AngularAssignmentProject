const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const Professor = require('../model/professor');

// Admin credentials (hardcoded)
const adminCredentials = {
  email: 'admin',
  password: 'admin123'
};

// POST /api/login
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (role === 'admin') {
      if (email === adminCredentials.email && password === adminCredentials.password) {
        return res.status(200).json({
          message: 'Admin login successful',
          admin: {
            id: 0,
            name: 'Administrator'
          }
        });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    }

    if (role === 'student') {
      const student = await Student.findOne({ email, password });
      if (!student) return res.status(401).json({ message: 'Invalid student credentials' });
      return res.json({ message: 'Login successful', student });
    }

    if (role === 'professor') {
      const professor = await Professor.findOne({ email, password });
      if (!professor) return res.status(401).json({ message: 'Invalid professor credentials' });
      return res.json({ message: 'Login successful', professor });
    }

    res.status(400).json({ message: 'Invalid role' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
