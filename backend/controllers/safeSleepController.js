const SafeSleep = require("../models/SafeSleep");

// @desc    Create a new safe sleep form
// @route   POST /api/safe-sleep
// @access  Private
const createSafeSleep = async (req, res) => {
  try {
    const safeSleep = new SafeSleep(req.body);

    const savedSafeSleep = await safeSleep.save();
    res.status(201).json({
      success: true,
      data: savedSafeSleep,
    });
  } catch (error) {
    console.error("Error creating safe sleep form:", error);
    res.status(400).json({
      success: false,
      message: "Error creating safe sleep form",
      error: error.message,
    });
  }
};

// @desc    Get all safe sleep forms for a user
// @route   GET /api/safe-sleep
// @access  Private
const getSafeSleepForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const safeSleepForms = await SafeSleep.find({ user: req.user.id })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SafeSleep.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: safeSleepForms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching safe sleep forms:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching safe sleep forms",
      error: error.message,
    });
  }
};

// @desc    Get a single safe sleep form by ID
// @route   GET /api/safe-sleep/:id
// @access  Private
const getSafeSleepByUser = async (req, res) => {
  try {
    const safeSleep = await SafeSleep.find({ user: req.params.id });

    res.json(safeSleep);
  } catch (error) {
    console.error("Error fetching safe sleep form:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching safe sleep form",
      error: error.message,
    });
  }
};

// @desc    Get a single safe sleep form by ID
// @route   GET /api/safe-sleep/:id
// @access  Private
const getSafeSleepByEnrollmentForm = async (req, res) => {
  try {
    const safeSleep = await SafeSleep.find({ enrollmentForm: req.params.id });

    res.json(safeSleep);
  } catch (error) {
    console.error("Error fetching safe sleep form:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching safe sleep form",
      error: error.message,
    });
  }
};

// @desc    Update a safe sleep form
// @route   PUT /api/safe-sleep/:id
// @access  Private
const updateSafeSleep = async (req, res) => {
  try {
    const safeSleep = await SafeSleep.findById(req.params.id);

    if (!safeSleep) {
      return res.status(404).json({
        success: false,
        message: "Safe sleep form not found",
      });
    }

    // Check if user owns this form
    if (safeSleep.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this form",
      });
    }

    const updatedSafeSleep = await SafeSleep.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    res.json({
      success: true,
      data: updatedSafeSleep,
    });
  } catch (error) {
    console.error("Error updating safe sleep form:", error);
    res.status(400).json({
      success: false,
      message: "Error updating safe sleep form",
      error: error.message,
    });
  }
};

// @desc    Delete a safe sleep form
// @route   DELETE /api/safe-sleep/:id
// @access  Private
const deleteSafeSleep = async (req, res) => {
  try {
    const safeSleep = await SafeSleep.findById(req.params.id);

    if (!safeSleep) {
      return res.status(404).json({
        success: false,
        message: "Safe sleep form not found",
      });
    }

    // Check if user owns this form
    if (safeSleep.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this form",
      });
    }

    await SafeSleep.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Safe sleep form deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting safe sleep form:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting safe sleep form",
      error: error.message,
    });
  }
};

module.exports = {
  createSafeSleep,
  getSafeSleepForms,
  getSafeSleepByUser,
  getSafeSleepByEnrollmentForm,
  updateSafeSleep,
  deleteSafeSleep,
};
