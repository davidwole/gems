const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createContact,
  getAllContacts,
  getContactsByBranch,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// Public route - no authentication needed for submitting contact form
router.post("/", createContact);

// Protected routes - require authentication and proper role
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3"]),
  getAllContacts
);
router.get(
  "/branch/:branchId",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  getContactsByBranch
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  updateContactStatus
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["L1", "L2"]),
  deleteContact
);

module.exports = router;
