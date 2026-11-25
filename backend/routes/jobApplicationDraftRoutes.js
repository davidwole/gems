const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  saveJobApplicationDraft,
  getJobApplicationDraft,
  deleteJobApplicationDraft,
} = require("../controllers/jobApplicationDraftController");

const router = express.Router();

// Save or update current user's job application draft
router.post("/", authMiddleware, saveJobApplicationDraft);

// Get current user's job application draft
router.get("/", authMiddleware, getJobApplicationDraft);

// Delete current user's job application draft
router.delete("/", authMiddleware, deleteJobApplicationDraft);

module.exports = router;

