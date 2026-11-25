const JobApplicationDraft = require("../models/JobApplicationDraft");

// Save or update the current user's job application draft
exports.saveJobApplicationDraft = async (req, res) => {
  try {
    const draftData = { ...req.body };
    delete draftData._id;

    const draft = await JobApplicationDraft.findOneAndUpdate(
      { user: req.user.id },
      {
        user: req.user.id,
        branch: draftData.branch || undefined,
        formData: draftData,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Job application draft saved successfully",
      data: draft,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get the current user's job application draft
exports.getJobApplicationDraft = async (req, res) => {
  try {
    const draft = await JobApplicationDraft.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: draft,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete the current user's job application draft
exports.deleteJobApplicationDraft = async (req, res) => {
  try {
    await JobApplicationDraft.findOneAndDelete({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: "Job application draft deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

