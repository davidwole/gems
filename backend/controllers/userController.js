const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Create User (L1 Superuser only)
exports.createUser = async (req, res) => {
  const { name, email, password, role, branch } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password, role, branch });
    await user.save();

    res.status(201).json({ msg: "User created successfully", user });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All User (L1 Superuser only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete User (L1 Superuser only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await User.findByIdAndDelete(id);
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getUsersByBranch = async (req, res) => {
  const { branchId } = req.params;

  try {
    // Find all users that belong to the specified branch
    const users = await User.find({ branch: branchId });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
    console.log(error.message);
  }
};

// Suspend/Unsuspend User (L1 Superuser only)
exports.toggleUserSuspension = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({
      msg: `User ${
        user.isSuspended ? "suspended" : "unsuspended"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
