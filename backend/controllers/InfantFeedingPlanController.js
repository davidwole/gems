// controllers/infantFeedingPlanController.js
const InfantFeedingPlan = require("../models/InfantFeedingPlan");

// @desc    Create a new infant feeding plan
// @route   POST /api/infant-feeding-plans
// @access  Private
const createInfantFeedingPlan = async (req, res) => {
  try {
    const infantFeedingPlan = await InfantFeedingPlan.create(req.body);

    console.log(infantFeedingPlan);

    res.status(201).json({
      success: true,
      data: infantFeedingPlan,
    });
  } catch (error) {
    console.error("Error creating infant feeding plan:", error);
    res.status(400).json({
      success: false,
      message: "Error creating infant feeding plan",
      error: error.message,
    });
  }
};

// @desc    Get all infant feeding plans for a user
// @route   GET /api/infant-feeding-plans
// @access  Private
const getInfantFeedingPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const plans = await InfantFeedingPlan.find({ user: req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await InfantFeedingPlan.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: plans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching infant feeding plans:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching infant feeding plans",
      error: error.message,
    });
  }
};

// @desc    Get a single infant feeding plan by ID
// @route   GET /api/infant-feeding-plans/:id
// @access  Private
const getInfantFeedingPlanByUser = async (req, res) => {
  try {
    const plan = await InfantFeedingPlan.find({ user: req.params.id });

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Error fetching infant feeding plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching infant feeding plan",
      error: error.message,
    });
  }
};
// @desc    Get a single infant feeding plan by ID
// @route   GET /api/infant-feeding-plans/:id
// @access  Private
const getInfantFeedingPlanByEnrollmentForm = async (req, res) => {
  try {
    const plan = await InfantFeedingPlan.find({
      enrollmentForm: req.params.id,
    });

    res.json(plan);
  } catch (error) {
    console.error("Error fetching infant feeding plan:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching infant feeding plan",
      error: error.message,
    });
  }
};

// @desc    Update an infant feeding plan
// @route   PUT /api/infant-feeding-plans/:id
// @access  Private
const updateInfantFeedingPlan = async (req, res) => {
  try {
    const plan = await InfantFeedingPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Infant feeding plan not found",
      });
    }

    // Check if user owns this plan
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this plan",
      });
    }

    const updatedPlan = await InfantFeedingPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    res.json({
      success: true,
      data: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating infant feeding plan:", error);
    res.status(400).json({
      success: false,
      message: "Error updating infant feeding plan",
      error: error.message,
    });
  }
};

// @desc    Delete an infant feeding plan
// @route   DELETE /api/infant-feeding-plans/:id
// @access  Private
const deleteInfantFeedingPlan = async (req, res) => {
  try {
    const plan = await InfantFeedingPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Infant feeding plan not found",
      });
    }

    // Check if user owns this plan
    if (plan.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this plan",
      });
    }

    await InfantFeedingPlan.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Infant feeding plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting infant feeding plan:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting infant feeding plan",
      error: error.message,
    });
  }
};

module.exports = {
  createInfantFeedingPlan,
  getInfantFeedingPlans,
  getInfantFeedingPlanByUser,
  getInfantFeedingPlanByEnrollmentForm,
  updateInfantFeedingPlan,
  deleteInfantFeedingPlan,
};
