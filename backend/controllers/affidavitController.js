// controllers/infantAffidavitController.js
const InfantAffidavit = require("../models/InfantAffidavit");

// @desc    Create a new infant affidavit
// @route   POST /api/infant-affidavits
// @access  Private
const createInfantAffidavit = async (req, res) => {
  try {
    const infantAffidavit = new InfantAffidavit(req.body);

    const savedAffidavit = await infantAffidavit.save();
    res.status(201).json({
      success: true,
      data: savedAffidavit,
    });
  } catch (error) {
    console.error("Error creating infant affidavit:", error);
    res.status(400).json({
      success: false,
      message: "Error creating infant affidavit",
      error: error.message,
    });
  }
};

// @desc    Get all infant affidavits for a user
// @route   GET /api/infant-affidavits
// @access  Private
const getInfantAffidavits = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const affidavits = await InfantAffidavit.find({ user: req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await InfantAffidavit.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: affidavits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching infant affidavits:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching infant affidavits",
      error: error.message,
    });
  }
};

// @desc    Get a single infant affidavit by ID
// @route   GET /api/infant-affidavits/:id
// @access  Private
const getInfantAffidavitByUser = async (req, res) => {
  try {
    const affidavit = await InfantAffidavit.find({ user: req.params.id });

    res.json(affidavit);
  } catch (error) {
    console.error("Error fetching infant affidavit:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching infant affidavit",
      error: error.message,
    });
  }
};

// @desc    Update an infant affidavit
// @route   PUT /api/infant-affidavits/:id
// @access  Private
const updateInfantAffidavit = async (req, res) => {
  try {
    const affidavit = await InfantAffidavit.findById(req.params.id);

    if (!affidavit) {
      return res.status(404).json({
        success: false,
        message: "Infant affidavit not found",
      });
    }

    // Check if user owns this affidavit
    if (affidavit.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this affidavit",
      });
    }

    const updatedAffidavit = await InfantAffidavit.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    res.json({
      success: true,
      data: updatedAffidavit,
    });
  } catch (error) {
    console.error("Error updating infant affidavit:", error);
    res.status(400).json({
      success: false,
      message: "Error updating infant affidavit",
      error: error.message,
    });
  }
};

// @desc    Delete an infant affidavit
// @route   DELETE /api/infant-affidavits/:id
// @access  Private
const deleteInfantAffidavit = async (req, res) => {
  try {
    const affidavit = await InfantAffidavit.findById(req.params.id);

    if (!affidavit) {
      return res.status(404).json({
        success: false,
        message: "Infant affidavit not found",
      });
    }

    // Check if user owns this affidavit
    if (affidavit.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this affidavit",
      });
    }

    await InfantAffidavit.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Infant affidavit deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting infant affidavit:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting infant affidavit",
      error: error.message,
    });
  }
};

module.exports = {
  createInfantAffidavit,
  getInfantAffidavits,
  getInfantAffidavitByUser,
  updateInfantAffidavit,
  deleteInfantAffidavit,
};
