const mongoose = require('mongoose');
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
    populateCourses();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

async function populateCourses() {
  try {
    // Clear the courses collection
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Sample course data with image URLs
    const courses = [
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe8'), name: 'Introduction to Programming', image: 'https://ui-avatars.com/api/?name=Introduction+to+Programming' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe9'), name: 'Data Structures', image: 'https://ui-avatars.com/api/?name=Data+Structures' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe6'), name: 'Algorithms', image: 'https://ui-avatars.com/api/?name=Algorithms' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfee'), name: 'Database Systems', image: 'https://ui-avatars.com/api/?name=Database+Systems' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe0'), name: 'Web Development', image: 'https://ui-avatars.com/api/?name=Web+Development' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff5'), name: 'Operating Systems', image: 'https://ui-avatars.com/api/?name=Operating+Systems' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bffa'), name: 'Machine Learning', image: 'https://ui-avatars.com/api/?name=Machine+Learning' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe3'), name: 'Software Engineering', image: 'https://ui-avatars.com/api/?name=Software+Engineering' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe1'), name: 'Computer Networks', image: 'https://ui-avatars.com/api/?name=Computer+Networks' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c005'), name: 'Artificial Intelligence', image: 'https://ui-avatars.com/api/?name=Artificial+Intelligence' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff4'), name: 'Cybersecurity', image: 'https://ui-avatars.com/api/?name=Cybersecurity' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe2'), name: 'Cloud Computing', image: 'https://ui-avatars.com/api/?name=Cloud+Computing' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff1'), name: 'Mobile App Development', image: 'https://ui-avatars.com/api/?name=Mobile+App+Development' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe7'), name: 'Systems Programming', image: 'https://ui-avatars.com/api/?name=Systems+Programming' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff3'), name: 'Distributed Systems', image: 'https://ui-avatars.com/api/?name=Distributed+Systems' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff0'), name: 'Computer Graphics', image: 'https://ui-avatars.com/api/?name=Computer+Graphics' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bffc'), name: 'Blockchain Technology', image: 'https://ui-avatars.com/api/?name=Blockchain+Technology' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bffd'), name: 'IoT Systems', image: 'https://ui-avatars.com/api/?name=IoT+Systems' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c008'), name: 'Big Data Analytics', image: 'https://ui-avatars.com/api/?name=Big+Data+Analytics' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff7'), name: 'Parallel Computing', image: 'https://ui-avatars.com/api/?name=Parallel+Computing' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bffb'), name: 'Game Development', image: 'https://ui-avatars.com/api/?name=Game+Development' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c00a'), name: 'Quantum Computing', image: 'https://ui-avatars.com/api/?name=Quantum+Computing' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfff'), name: 'Embedded Systems', image: 'https://ui-avatars.com/api/?name=Embedded+Systems' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c002'), name: 'Network Security', image: 'https://ui-avatars.com/api/?name=Network+Security' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff9'), name: 'Human-Computer Interaction', image: 'https://ui-avatars.com/api/?name=Human-Computer+Interaction' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c006'), name: 'Compiler Design', image: 'https://ui-avatars.com/api/?name=Compiler+Design' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff2'), name: 'DevOps Practices', image: 'https://ui-avatars.com/api/?name=DevOps+Practices' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfef'), name: 'Information Retrieval', image: 'https://ui-avatars.com/api/?name=Information+Retrieval' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c001'), name: 'Data Mining', image: 'https://ui-avatars.com/api/?name=Data+Mining' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe5'), name: 'Computer Architecture', image: 'https://ui-avatars.com/api/?name=Computer+Architecture' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bffe'), name: 'Robotics', image: 'https://ui-avatars.com/api/?name=Robotics' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c009'), name: 'Natural Language Processing', image: 'https://ui-avatars.com/api/?name=Natural+Language+Processing' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c004'), name: 'Computer Vision', image: 'https://ui-avatars.com/api/?name=Computer+Vision' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfed'), name: 'Software Testing', image: 'https://ui-avatars.com/api/?name=Software+Testing' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c000'), name: 'Theory of Computation', image: 'https://ui-avatars.com/api/?name=Theory+of+Computation' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c007'), name: 'Cryptography', image: 'https://ui-avatars.com/api/?name=Cryptography' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff6'), name: 'Augmented Reality', image: 'https://ui-avatars.com/api/?name=Augmented+Reality' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bff8'), name: 'Virtual Reality', image: 'https://ui-avatars.com/api/?name=Virtual+Reality' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3c003'), name: 'Ethical Hacking', image: 'https://ui-avatars.com/api/?name=Ethical+Hacking' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfe4'), name: 'Digital Forensics', image: 'https://ui-avatars.com/api/?name=Digital+Forensics' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfec'), name: 'Bioinformatics', image: 'https://ui-avatars.com/api/?name=Bioinformatics' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfea'), name: 'Signal Processing', image: 'https://ui-avatars.com/api/?name=Signal+Processing' },
      { _id: mongoose.Types.ObjectId('6832f712ea2c42c582a3bfeb'), name: 'Advanced Algorithms', image: 'https://ui-avatars.com/api/?name=Advanced+Algorithms' },
    ];

    // Insert courses
    await Course.insertMany(courses);
    console.log('Courses populated successfully');
  } catch (err) {
    console.error('Error populating courses:', err);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}