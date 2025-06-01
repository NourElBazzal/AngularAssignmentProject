const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const Professor = require('../model/professor');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Admin credentials (hardcoded)
const adminCredentials = {
  email: 'admin',
  password: 'admin123'
};

// Function to check if a password is hashed (e.g., starts with $2b$ or is long enough)
function isHashedPassword(password) {
  return password && password.length > 20 && password.startsWith('$2b$'); // Typical bcrypt hash length
}

router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log('Login attempt:', { email, role }); // Debug log

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
      const student = await Student.findOne({ email });
      if (!student) return res.status(401).json({ message: 'Invalid student credentials' });
      if (isHashedPassword(student.password)) {
        if (!(await bcrypt.compare(password, student.password))) {
          return res.status(401).json({ message: 'Invalid student credentials' });
        }
      } else if (student.password !== password) {
        return res.status(401).json({ message: 'Invalid student credentials' });
      }
      return res.json({ message: 'Login successful', student });
    }

    if (role === 'professor') {
      const professor = await Professor.findOne({ email });
      console.log('Found professor:', professor); // Debug log
      if (!professor) return res.status(401).json({ message: 'Invalid professor credentials' });
      if (isHashedPassword(professor.password)) {
        if (!(await bcrypt.compare(password, professor.password))) {
          return res.status(401).json({ message: 'Invalid professor credentials' });
        }
      } else if (professor.password !== password) {
        return res.status(401).json({ message: 'Invalid professor credentials' });
      }
      return res.json({ message: 'Login successful', professor });
    }

    res.status(400).json({ message: 'Invalid role' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;