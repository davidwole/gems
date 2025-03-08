const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// Register a new parent
exports.registerParent = async (req, res) => {
  const { name, email, password, branch, role } = req.body;

  try {
    // Check if the email is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Ensure that the role is set to L8 (Parent)
    const parentRole = role === "L8" ? role : "L8";

    // Create the parent user
    user = new User({
      name,
      email,
      password,
      branch,
      role: parentRole,
      status: "active", // Parents are immediately active
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        branch: user.branch,
        isSuspended: user.isSuspended,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Give them a week to complete the application
    );

    res.status(201).json({
      message: "Parent registration successful",
      token,
    });
  } catch (error) {
    console.error("Parent registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};
