const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createInfantFeedingPlan,
  getAllInfantFeedingPlans,
  getInfantFeedingPlansByBranch,
  getInfantFeedingPlansByUser,
  getInfantFeedingPlanById,
  updateInfantFeedingPlan,
  updatePlanStatus,
  deleteInfantFeedingPlan,
} = require("../controllers/InfantFeedingPlanController");

const router = express.Router();

// Create an infant feeding plan - any authenticated user can create
router.post("/", authMiddleware, createInfantFeedingPlan);

// Get all infant feeding plans - admin only
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  getAllInfantFeedingPlans
);

// Get infant feeding plans by branch - admin and branch managers
router.get(
  "/branch/:branchId",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3"]),
  getInfantFeedingPlansByBranch
);

// Get current user's infant feeding plans
router.get("/me", authMiddleware, getInfantFeedingPlansByUser);

// Get specific user's infant feeding plans - admin only
router.get(
  "/user/:userId",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  getInfantFeedingPlansByUser
);

// Get a single infant feeding plan by ID
router.get("/:id", authMiddleware, getInfantFeedingPlanById);

// Update an infant feeding plan - owner or admin
router.put("/:id", authMiddleware, updateInfantFeedingPlan);

// Update infant feeding plan status - admin only
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["L1", "L2", "L3", "L4"]),
  updatePlanStatus
);

// Delete an infant feeding plan - owner or admin
router.delete("/:id", authMiddleware, deleteInfantFeedingPlan);

module.exports = router;
