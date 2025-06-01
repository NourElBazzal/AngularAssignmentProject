const mongoose = require('mongoose');
const Student = require('./model/student');
const Assignment = require('./model/assignment');
const Course = require('./model/course');

// Connect to MongoDB
const uri = 'mongodb+srv://nourbazzal4:Nour4@cluster0.ngjwe.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB');
    updateAssignments();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

async function updateAssignments() {
  try {
    // Fetch all students
    const students = await Student.find();
    console.log(`Found ${students.length} students`);

    // Find the highest existing assignment ID
    const highestAssignment = await Assignment.findOne()
      .sort({ id: -1 })
      .select('id');
    let assignmentIdCounter = highestAssignment ? highestAssignment.id + 1 : 1;
    console.log(`Starting assignment ID counter at: ${assignmentIdCounter}`);

    // Fetch all courses to map courseIds to names
    const courses = await Course.find().lean();
    const courseMap = new Map(courses.map(course => [course._id.toString(), course.name]));

    // Process each student
    for (const student of students) {
      console.log(`Processing student: ${student.fullName} (ID: ${student.id})`);

      // Clear the student's assignments array
      student.assignments = [];
      console.log(`Cleared assignments for student ${student.id}`);

      // Process each course
      for (const courseIdStr of student.coursesTaken) {
        const courseId = mongoose.Types.ObjectId(courseIdStr);
        const courseName = courseMap.get(courseIdStr) || `Course ${courseIdStr}`;

        // Look for an existing unassigned assignment with this courseId
        let assignment = await Assignment.findOne({ 
          courseId: courseId, 
          $or: [
            { studentId: { $exists: false } },
            { studentId: null }
          ]
        });

        if (assignment) {
          // Update the unassigned assignment with studentId and name
          assignment.studentId = student.id;
          assignment.name = `${courseName} - ${student.fullName}`;
          await assignment.save();
          console.log(`Assigned and updated existing unassigned assignment for course "${courseName}" to student ${student.id}: ${assignment._id}`);
        } else {
          // Check if an assignment exists for this courseId with a different studentId
          const existingAssigned = await Assignment.findOne({ 
            courseId: courseId, 
            studentId: { $ne: student.id }
          });
          if (existingAssigned) {
            console.log(`Found existing assignment for course "${courseName}" assigned to another student (${existingAssigned.studentId}). Creating new assignment.`);
          }

          // Create a new assignment
          assignment = new Assignment({
            id: assignmentIdCounter++,
            name: `${courseName} - ${student.fullName}`,
            dueDate: new Date('2025-06-30'),
            courseId: courseId,
            submitted: false,
            fileUrl: null,
            grade: null,
            feedback: null,
            studentId: student.id
          });
          assignment = await assignment.save();
          console.log(`Created new assignment for course "${courseName}" to student ${student.id}: ${assignment._id}`);
        }

        // Add the assignment's _id to the student's assignments array
        student.assignments.push(assignment._id.toString());
      }

      // Save the updated student
      await student.save();
      console.log(`Updated student ${student.id} with ${student.assignments.length} assignments`);
    }

    console.log('Database update completed successfully');
  } catch (err) {
    console.error('Error during database update:', err);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}