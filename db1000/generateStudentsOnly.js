const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://nourbazzal4:Nour4@cluster0.ngjwe.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0";

// === SCHEMAS ===
const assignmentSchema = new mongoose.Schema({
  submitted: Boolean,
  _id: String, // UUID format
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
  assignments: [String] //  UUIDs (not ObjectIds)
});
const Student = mongoose.model("Student", studentSchema);

// === GENERATOR ===
function generateStudents(courseDocs, assignments, count = 50) {
  const students = [];

  for (let i = 1; i <= count; i++) {
    const fullName = faker.person.fullName(); // new faker API
    const chosenCourses = faker.helpers.shuffle(courseDocs).slice(0, 5);
    const courseIds = chosenCourses.map(c => c._id);

    const relevantAssignments = assignments.filter(a =>
      a.courseId && courseIds.some(cid => a.courseId.toString() === cid.toString())
    );

    students.push({
      id: i,
      fullName,
      email: faker.internet.email({ firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1] }),
      password: faker.internet.password(10),
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
      coursesTaken: courseIds,
      assignments: relevantAssignments.map(a => a._id) // <-- UUID strings
    });
  }

  return students;
}

// === MAIN FUNCTION ===
async function insertStudents() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" Connected to MongoDB");

    const courses = await Course.find({});
    const assignments = await Assignment.find({});

    const students = generateStudents(courses, assignments, 50);
    await Student.insertMany(students);
    console.log(` Inserted ${students.length} students`);

    await mongoose.connection.close();
    console.log(" MongoDB connection closed");
  } catch (err) {
    console.error(" Error inserting students:", err);
  }
}

insertStudents();
