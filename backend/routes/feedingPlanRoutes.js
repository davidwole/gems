// routes/infantFeedingPlanRoutes.js
const express = require("express");
const {
  createInfantFeedingPlan,
  getInfantFeedingPlans,
  getInfantFeedingPlanByUser,
  updateInfantFeedingPlan,
  deleteInfantFeedingPlan,
  getInfantFeedingPlanByEnrollmentForm,
} = require("../controllers/InfantFeedingPlanController");

const router = express.Router();

// @route   POST /api/infant-feeding-plans
// @desc    Create a new infant feeding plan
// @access  Private
router.post("/", createInfantFeedingPlan);

// @route   GET /api/infant-feeding-plans
// @desc    Get all infant feeding plans for a user
// @access  Private
// router.get("/", getInfantFeedingPlans);

// @route   GET /api/infant-feeding-plans/:id
// @desc    Get a single infant feeding plan by ID
// @access  Private
router.get("/:id", getInfantFeedingPlanByEnrollmentForm);

// @route   PUT /api/infant-feeding-plans/:id
// @desc    Update an infant feeding plan
// @access  Private
router.put("/:id", updateInfantFeedingPlan);

// @route   DELETE /api/infant-feeding-plans/:id
// @desc    Delete an infant feeding plan
// @access  Private
router.delete("/:id", deleteInfantFeedingPlan);

module.exports = router;
