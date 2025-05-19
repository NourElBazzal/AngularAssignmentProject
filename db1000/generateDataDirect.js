// generateUniversityAssignments.js

const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

// MongoDB connection string (replace with your own)
const MONGODB_URI = "mongodb+srv://nourbazzal4:Nour4@cluster0.ngjwe.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0";

// Define the schema (adjust to match your MongoDB collection)
const assignmentSchema = new mongoose.Schema({
  submitted: Boolean,
  _id: String,
  id: Number,
  name: String,
  dueDate: Date,
  //feedback: String,
  //fileUrl: String
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

// Number of records to generate
const RECORD_COUNT = 1000;

// Function to generate a single assignment record
function generateAssignmentRecord(id) {
  return {
    submitted: faker.datatype.boolean(),
    _id: faker.string.uuid(),
    id: id,
    name: faker.helpers.arrayElement([
      "Computer Networks Homework",
      "Database Systems Project",
      "Operating Systems Assignment",
      "Software Engineering Report",
      "Web Development Project",
      "Data Structures Homework",
      "Machine Learning Assignment",
      "Artificial Intelligence Project",
      "Cybersecurity Report",
      "Computer Networks",
      "Database Systems",
      "Introduction to Artificial Intelligence",
      "Software Engineering",
      "Operating Systems",
      "Discrete Mathematics",
      "Machine Learning",
      "Data Structures and Algorithms",
      "Web Development",
      "Cloud Computing",
      "Computer Vision",
      "Natural Language Processing",
      "Mobile App Development",
      "Game Development",
      "Human-Computer Interaction",
      "Computer Graphics",
      "Information Retrieval",
      "Computer Architecture",
      "Network Security",
      "Distributed Systems",
      "Data Mining",
      "Big Data Analytics",
      "Internet of Things",
      "Blockchain Technology",
      "Augmented Reality",
      "Virtual Reality",
      "Quantum Computing",
      "Robotics",
      "Digital Signal Processing",
      "Embedded Systems",
      "Parallel Computing",
      "Software Testing",
      "Software Quality Assurance",
      "Software Project Management",
      "Software Requirements Engineering",
      "Software Design Patterns",
      "Software Architecture",
      "Software Development Methodologies",
      "Software Configuration Management",
      "Software Maintenance",
      "Software Documentation",
      "Software Metrics"
    ]),
    dueDate: faker.date.future(),
    //feedback: faker.lorem.sentence(),
    //fileUrl: faker.internet.url()
  };
}

// Connect to MongoDB and insert records
async function insertFakeAssignments() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const records = Array.from({ length: RECORD_COUNT }, (_, index) => generateAssignmentRecord(index + 5));
    await Assignment.insertMany(records);
    console.log(`${RECORD_COUNT} assignment records have been inserted successfully.`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

insertFakeAssignments();
