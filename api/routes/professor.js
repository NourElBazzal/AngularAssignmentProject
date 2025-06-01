const express = require('express');
const router = express.Router();
const Professor = require('../model/professor');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Multer config for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all professors
router.get('/', async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a specific professor by ID
router.get('/:id', async (req, res) => {
  try {
    const professor = await Professor.findOne({ id: req.params.id });
    if (!professor) return res.status(404).json({ message: 'Professor not found' });
    res.json(professor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ PUT: Update professor with password + image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    const updated = await Professor.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateData },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Professor not found' });

    res.json({ message: 'Professor updated', professor: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE professor
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Professor.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: 'Professor not found' });
    res.json({ message: 'Professor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
