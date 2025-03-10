const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createEnrollmentForm,
  getAllEnrollmentForms,
  getEnrollmentFormsByBranch,
  getEnrollmentFormsByUser,
  getEnrollmentFormById,
  updateEnrollmentForm,
  updateFormStatus,
  deleteEnrollmentForm,
} = require("../controllers/enrollmentFormController");

const router = express.Router();

// Create an enrollment form - any authenticated user can create
router.post("/", authMiddleware, createEnrollmentForm);

// Get all enrollment forms - admin only
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  getAllEnrollmentForms
);

// Get enrollment forms by branch - admin and branch managers
router.get(
  "/branch/:branchId",
  // authMiddleware,
  // roleMiddleware(["L1", "L2", "L3"]),
  getEnrollmentFormsByBranch
);

// Get current user's enrollment forms
router.get("/me", authMiddleware, getEnrollmentFormsByUser);

// Get specific user's enrollment forms - admin only
router.get(
  "/user/:userId",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  getEnrollmentFormsByUser
);

// Get a single enrollment form by ID
router.get("/:id", authMiddleware, getEnrollmentFormById);

// Update an enrollment form - owner or admin
router.put("/:id", authMiddleware, updateEnrollmentForm);

// Update enrollment form status - admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  updateFormStatus
);

// Delete an enrollment form - owner or admin
router.delete("/:id", authMiddleware, deleteEnrollmentForm);

module.exports = router;
