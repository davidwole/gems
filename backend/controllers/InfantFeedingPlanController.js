const InfantFeedingPlan = require("../models/InfantFeedingPlan");
const User = require("../models/User");

// Create an infant feeding plan
exports.createInfantFeedingPlan = async (req, res) => {
  try {
    // Create a new plan with the request body
    const newPlan = new InfantFeedingPlan(req.body);

    // Save the plan to the database
    const savedPlan = await newPlan.save();

    res.status(201).json({
      success: true,
      message: "Infant feeding plan submitted successfully",
      data: savedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all infant feeding plans (admin access)
exports.getAllInfantFeedingPlans = async (req, res) => {
  try {
    const plans = await InfantFeedingPlan.find()
      .populate("user", "name email")
      .populate("branch", "name");

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get infant feeding plans by branch
exports.getInfantFeedingPlansByBranch = async (req, res) => {
  const { branchId } = req.params;

  try {
    const plans = await InfantFeedingPlan.find({ branch: branchId })
      .populate("user", "name email")
      .populate("branch", "name");

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get infant feeding plans by user
exports.getInfantFeedingPlansByUser = async (req, res) => {
  const userId = req.params.userId || req.user.id;

  try {
    const plans = await InfantFeedingPlan.find({ user: userId }).populate(
      "branch",
      "name"
    );

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single infant feeding plan by ID
exports.getInfantFeedingPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await InfantFeedingPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Infant feeding plan not found",
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an infant feeding plan
exports.updateInfantFeedingPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await InfantFeedingPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Infant feeding plan not found",
      });
    }

    // Check if the user is the owner of the plan or has admin privileges
    if (
      plan.user.toString() !== req.user.id &&
      req.user.role !== "L1" &&
      req.user.role !== "L2"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this plan",
      });
    }

    const updatedPlan = await InfantFeedingPlan.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Infant feeding plan updated successfully",
      data: updatedPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update infant feeding plan status (approve/reject)
exports.updatePlanStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await InfantFeedingPlan.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Infant feeding plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Infant feeding plan status updated successfully`,
      data: plan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete an infant feeding plan
exports.deleteInfantFeedingPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await InfantFeedingPlan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Infant feeding plan not found",
      });
    }

    // Check if the user is the owner of the plan or has admin privileges
    if (plan.user.toString() !== req.user.id && req.user.role !== "L1") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this plan",
      });
    }

    await InfantFeedingPlan.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Infant feeding plan deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
