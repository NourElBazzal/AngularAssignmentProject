// generateCoursesProfsStudents.js

const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

// MongoDB URI
const MONGODB_URI = "mongodb+srv://nourbazzal4:Nour4@cluster0.ngjwe.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0";

// === SCHEMAS ===
const assignmentSchema = new mongoose.Schema({
  submitted: Boolean,
  _id: String,
  id: Number,
  name: String,
  dueDate: Date,
  courseId: mongoose.Schema.Types.ObjectId
});
const Assignment = mongoose.model("Assignment", assignmentSchema);

const courseSchema = new mongoose.Schema({
  name: String,
  image: String
});
const Course = mongoose.model("Course", courseSchema);

const professorSchema = new mongoose.Schema({
  id: Number,
  name: String,
  email: String,
  password: String,
  image: String,
  courseIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
});
const Professor = mongoose.model("Professor", professorSchema);

const studentSchema = new mongoose.Schema({
  id: Number,
  fullName: String,
  email: String,
  password: String,
  image: String,
  coursesTaken: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment"
  }]
});
const Student = mongoose.model("Student", studentSchema);

// === COURSE NAMES ===
const courseNames = [...new Set([
  "Computer Networks", "Database Systems", "Operating Systems", "Software Engineering",
  "Web Development", "Data Structures", "Machine Learning", "Artificial Intelligence",
  "Cybersecurity", "Discrete Mathematics", "Cloud Computing", "Computer Vision",
  "Natural Language Processing", "Mobile App Development", "Game Development",
  "Human-Computer Interaction", "Computer Graphics", "Information Retrieval",
  "Computer Architecture", "Network Security", "Distributed Systems", "Data Mining",
  "Big Data Analytics", "Internet of Things", "Blockchain Technology", "Augmented Reality",
  "Virtual Reality", "Quantum Computing", "Robotics", "Digital Signal Processing",
  "Embedded Systems", "Parallel Computing", "Software Testing",
  "Software Quality Assurance", "Software Project Management",
  "Software Requirements Engineering", "Software Design Patterns", "Software Architecture",
  "Software Development Methodologies", "Software Configuration Management",
  "Software Maintenance", "Software Documentation", "Software Metrics"
])];

// === GENERATORS ===
function generateCourses() {
  return courseNames.map(name => ({
    name,
    image: `https://source.unsplash.com/400x300/?${encodeURIComponent(name)}`
  }));
}

function generateProfessors(courseDocs) {
  const shuffledCourses = faker.helpers.shuffle(courseDocs);
  const professorCount = 10;
  const courseGroups = Array.from({ length: professorCount }, (_, i) =>
    shuffledCourses.slice(i * 5, (i + 1) * 5)
  );

  return courseGroups.map((group, index) => {
    const fullName = faker.name.fullName();
    return {
      id: index + 1,
      name: fullName,
      email: faker.internet.email(fullName.split(' ')[0], fullName.split(' ')[1]),
      password: faker.internet.password(10),  // Random password
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
      courseIds: group.map(c => c._id)
    };
  });
}

function generateStudents(courseDocs, assignments, count = 50) {
  const students = [];

  for (let i = 1; i <= count; i++) {
    const fullName = faker.name.fullName();
    const chosenCourses = faker.helpers.shuffle(courseDocs).slice(0, 5);
    const courseIds = chosenCourses.map(c => c._id);

    // Find relevant assignments
    const relevantAssignments = assignments.filter(a =>
      courseIds.some(cid => a.courseId?.toString() === cid.toString())
    );

    students.push({
      id: i,
      fullName,
      email: faker.internet.email(fullName.split(' ')[0], fullName.split(' ')[1]),
      password: faker.internet.password(10),  // Random password
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
      coursesTaken: courseIds,
      assignments: relevantAssignments.map(a => a._id)
    });
  }

  return students;
}

// === MAIN FUNCTION ===
async function insertData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" Connected to MongoDB");

    // 1. Load all existing assignments
    const allAssignments = await Assignment.find({});
    console.log(`ℹ Found ${allAssignments.length} assignments`);

    // 2. Insert courses
    const courseDocs = await Course.insertMany(generateCourses());
    console.log(` Inserted ${courseDocs.length} courses`);

    // 3. Link assignments to courseId
    const courseMap = new Map();
    courseDocs.forEach(course => courseMap.set(course.name.toLowerCase(), course._id));

    let updatedCount = 0;
    for (const assignment of allAssignments) {
      const match = courseNames.find(course =>
        assignment.name.toLowerCase().includes(course.toLowerCase())
      );

      if (match) {
        assignment.courseId = courseMap.get(match.toLowerCase());
        await assignment.save();
        updatedCount++;
      }
    }
    console.log(` Linked ${updatedCount} assignments to courses`);

    // 4. Create and insert professors
    const professors = generateProfessors(courseDocs);
    await Professor.insertMany(professors);
    console.log(` Inserted ${professors.length} professors`);

    // 5. Create and insert students
    const students = generateStudents(courseDocs, await Assignment.find({}), 50);
    await Student.insertMany(students);
    console.log(` Inserted ${students.length} students`);

    await mongoose.connection.close();
    console.log(" MongoDB connection closed");
  } catch (err) {
    console.error(" Error:", err);
  }
}

insertData();
