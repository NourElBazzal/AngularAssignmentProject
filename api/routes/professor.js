const express = require('express');
const router = express.Router();
const Professor = require('../model/professor');

// Example: Get all professors
router.get('/', async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Example: Get a specific professor by ID
router.get('/:id', async (req, res) => {
  try {
    const professor = await Professor.findOne({ id: req.params.id });
    if (!professor) return res.status(404).json({ message: 'Professor not found' });
    res.json(professor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Example: Update professor
router.put('/:id', async (req, res) => {
  try {
    const updatedProfessor = await Professor.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedProfessor) return res.status(404).json({ message: 'Professor not found' });
    res.json({ message: 'Professor updated', professor: updatedProfessor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Example: Delete professor
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
