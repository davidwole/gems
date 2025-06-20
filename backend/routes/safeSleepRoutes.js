// routes/safeSleepRoutes.js
const express = require("express");
const {
  createSafeSleep,
  getSafeSleepForms,
  getSafeSleepByUser,
  updateSafeSleep,
  deleteSafeSleep,
} = require("../controllers/safeSleepController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/safe-sleep
// @desc    Create a new safe sleep form
// @access  Private
router.post("/", createSafeSleep);

// @route   GET /api/safe-sleep
// @desc    Get all safe sleep forms for a user
// @access  Private
// router.get("/", getSafeSleepForms);

// @route   GET /api/safe-sleep/:id
// @desc    Get a single safe sleep form by ID
// @access  Private
router.get("/:id", getSafeSleepByUser);

// @route   PUT /api/safe-sleep/:id
// @desc    Update a safe sleep form
// @access  Private
router.put("/:id", updateSafeSleep);

// @route   DELETE /api/safe-sleep/:id
// @desc    Delete a safe sleep form
// @access  Private
router.delete("/:id", deleteSafeSleep);

module.exports = router;
