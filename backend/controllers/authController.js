const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password, role });
    await user.save();

    res
      .status(201)
      .json({ _id: user.id, name, email, role, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Check if user is suspended before validating password
    if (user.isSuspended) {
      return res.status(403).json({
        msg: "Your account has been suspended. Please contact an administrator.",
      });
    }

    // Validate password
    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Generate token that includes suspension status
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        isSuspended: user.isSuspended,
        branch: user.branch,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
