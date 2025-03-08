const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and check if suspended
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Check if user is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        msg: "Your account has been suspended. Please contact an administrator.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
