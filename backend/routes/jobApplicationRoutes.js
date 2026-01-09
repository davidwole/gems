const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createJobApplication,
  getAllJobApplications,
  getJobApplicationsByBranch,
  getJobApplicationsByUser,
  getJobApplicationById,
  updateJobApplication,
  updateApplicationStatus,
  scheduleInterview,
  deleteJobApplication,
} = require("../controllers/jobApplicationController");

const router = express.Router();

// Create a job application - any authenticated user
router.post("/", authMiddleware, createJobApplication);

// Get all job applications - admin only
router.get(
  "/",
  authMiddleware,
  // roleMiddleware(["L1", "L2", "L3"]),
  getAllJobApplications
);

// Get job applications by branch - admin and branch managers
router.get(
  "/branch/:branchId",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3"]),
  getJobApplicationsByBranch
);

// Get current user's job applications
router.get("/application/:id", authMiddleware, getJobApplicationsByUser);

// Get a single job application by ID
router.get("/:id", authMiddleware, getJobApplicationById);

// Update a job application - owner or admin
router.put("/:id", authMiddleware, updateJobApplication);

// Update job application status - admin only
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3"]),
  updateApplicationStatus
);

// Schedule an interview - admin only
router.patch(
  "/:id/schedule-interview",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3"]),
  scheduleInterview
);

// Delete a job application - owner or L1 admin
router.delete("/:id", authMiddleware, deleteJobApplication);

module.exports = router;
