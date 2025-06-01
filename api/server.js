const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');

mongoose.Promise = global.Promise;
const uri = 'mongodb+srv://nourbazzal4:Nour4@cluster0.ngjwe.mongodb.net/assignmentsDB?retryWrites=true&w=majority&appName=Cluster0';
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

const prefix = '/api';
app.use(prefix + '/assignments', assignmentsRouter);
app.use(prefix + '/students', studentRouter);
app.use(prefix + '/professors', professorRouter);
app.use(prefix + '/login', loginRouter);
app.use(prefix + '/users', usersRouter); 

const port = process.env.PORT || 8010;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started at http://localhost:${port}`);
});

module.exports = app;