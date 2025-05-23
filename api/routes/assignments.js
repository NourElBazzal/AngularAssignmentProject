const express = require('express');
const router = express.Router();
const Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
router.get('/', (req, res) => {
  Assignment.find((err, assignments) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(assignments);
    }
  });
});

// Récupérer un assignment par son id (GET)
router.get('/:id', (req, res) => {
  let assignmentId = Number(req.params.id);
  Assignment.findOne({ id: assignmentId }, (err, assignment) => {
    if (err) {
      res.status(500).send(err);
    } else if (!assignment) {
      res.status(404).send('Assignment not found');
    } else {
      res.json(assignment);
    }
  });
});

// Ajout d'un assignment (POST)
router.post('/', (req, res) => {
  // Create assignment without _id to let MongoDB generate it
  const assignmentData = {
    id: req.body.id,
    name: req.body.name,
    dueDate: req.body.dueDate,
    submitted: req.body.submitted || false,
    fileUrl: req.body.fileUrl,
    grade: req.body.grade,
    feedback: req.body.feedback
  };

  console.log("POST assignment reçu :");
  console.log("Request body:", req.body);
  console.log("Assignment data:", assignmentData);

  // Validate required fields
  if (!assignmentData.id || !assignmentData.name || !assignmentData.dueDate) {
    console.log('Validation error: Missing required fields');
    return res.status(400).send('Missing required fields: id, name, dueDate');
  }

  // Check for duplicate ID
  Assignment.findOne({ id: assignmentData.id }, (err, existing) => {
    if (err) {
      console.error('Error checking ID:', err);
      return res.status(500).send('Error checking ID: ' + err.message);
    }
    if (existing) {
      console.log('Duplicate ID found:', assignmentData.id);
      return res.status(400).send('ID already exists: ' + assignmentData.id);
    }

    const assignment = new Assignment(assignmentData);
    assignment.save((err, savedAssignment) => {
      if (err) {
        console.error('Error saving assignment:', err);
        return res.status(500).send('Cannot post assignment: ' + err.message);
      }
      console.log('Assignment saved successfully:', savedAssignment);
      res.json({ message: `${savedAssignment.name} saved!`, id: savedAssignment.id });
    });
  });
});

// Update d'un assignment (PUT)
router.put('/:id', (req, res) => {
  console.log("UPDATE reçu assignment : ");
  console.log('Params ID:', req.params.id);
  console.log('Body:', req.body);
  const assignmentId = Number(req.params.id);

  // Validate required fields
  if (req.body.name == null || req.body.dueDate == null) {
    console.log('Validation error: Name and dueDate cannot be null');
    return res.status(400).send('Name and dueDate cannot be null');
  }

  const updateData = {};
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.dueDate !== undefined) updateData.dueDate = req.body.dueDate;
  if (req.body.submitted !== undefined) updateData.submitted = req.body.submitted;
  if (req.body.fileUrl !== undefined) updateData.fileUrl = req.body.fileUrl;
  if (req.body.grade !== undefined) updateData.grade = req.body.grade;
  if (req.body.feedback !== undefined) updateData.feedback = req.body.feedback;

  Assignment.findOneAndUpdate(
    { id: assignmentId },
    { $set: updateData },
    { new: true, runValidators: true },
    (err, assignment) => {
      if (err) {
        console.error('Error updating assignment:', err);
        res.status(500).send(err.message);
      } else if (!assignment) {
        console.log('Assignment not found for id:', assignmentId);
        res.status(404).send('Assignment not found');
      } else {
        console.log('Assignment updated:', assignment);
        res.json({ message: 'updated', assignment });
      }
    }
  );
});

// Suppression d'un assignment (DELETE)
router.delete('/:id', (req, res) => {
  let assignmentId = Number(req.params.id);
  Assignment.findOneAndRemove({ id: assignmentId }, (err, assignment) => {
    if (err) {
      res.status(500).send(err);
    } else if (!assignment) {
      res.status(404).send('Assignment not found');
    } else {
      res.json({ message: `${assignment.name} deleted` });
    }
  });
});

module.exports = router;