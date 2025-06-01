const express = require('express');
const router = express.Router();
const Course = require('../model/course');

// GET all courses
router.get('/', (req, res) => {
  Course.find((err, courses) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(courses);
    }
  });
});

module.exports = router;