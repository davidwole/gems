const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/register-applicant", async (req, res) => {
  const { name, email, password, position, branch, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Create a new user with role L6 (applicant)
    user = new User({
      name,
      email,
      password,
      role: "L6", // Force role to be L6 regardless of input
      branch,
      position, // Store the position they're applying for
      status: "applicant", // Add a status field to track applicants
      applicationComplete: false,
      tasks: {
        i9Completed: false,
        idUploaded: false,
        handbookSigned: false,
      },
    });

    await user.save();

    // Generate token that includes applicant status
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        branch: user.branch,
        status: user.status,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Give them a week to complete the application
    );

    res.status(201).json({
      msg: "Application started successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
