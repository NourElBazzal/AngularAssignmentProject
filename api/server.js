const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 8010;

mongoose.Promise = global.Promise;

const urii = 'mongodb+srv://nourbazzal4:Nour4@cluster0.ngjwe.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';
const uri = process.env.MONGODB_URI || uri; 
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connected to MongoDB at", uri);
    console.log("Test with: http://localhost:8010/api/assignments");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const assignmentsRouter = require('./routes/assignments');
const studentRouter = require('./routes/student');
const professorRouter = require('./routes/professor');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users'); 
const coursesRouter = require('./routes/courses'); 

const prefix = '/api';
app.use(prefix + '/assignments', assignmentsRouter);
app.use(prefix + '/students', studentRouter);
app.use(prefix + '/professors', professorRouter);
app.use(prefix + '/login', loginRouter);
app.use(prefix + '/users', usersRouter);
app.use(prefix + '/courses', coursesRouter); 

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


module.exports = app;