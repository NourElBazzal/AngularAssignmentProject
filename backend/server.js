require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/assignmentsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("User", {
  username: String,
  password: String,
  role: String, // 'admin' or 'user'
});

// Hash passwords
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret Key for JWT
const SECRET_KEY = "your_secret_key";

// Register User
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });
  await newUser.save();
  res.json({ message: "User created!" });
});

// Login User
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token, role: user.role });
});

// Verify JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token required" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Protected Route Example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Welcome to protected route", user: req.user });
});

app.listen(5000, () => console.log("Server running on port 5000"));
