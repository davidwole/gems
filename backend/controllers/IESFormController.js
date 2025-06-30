const IESForm = require("../models/IESForm");
const User = require("../models/User");

// Create an enrollment form
exports.createEnrollmentForm = async (req, res) => {
  try {
    // Create a new form with the request body
    const newForm = new IESForm(req.body);

    // Save the form to the database
    const savedForm = await newForm.save();

    res.status(201).json({
      success: true,
      message: "Enrollment form submitted successfully",
      data: savedForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all enrollment forms
exports.getAllEnrollmentForms = async (req, res) => {
  try {
    const forms = await IESForm.find()
      .populate("user", "name email")
      .populate("branch", "name");

    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get enrollment forms by branch
exports.getEnrollmentFormsByBranch = async (req, res) => {
  const { branchId } = req.params;

  try {
    const forms = await IESForm.find({ branch: branchId });
    // .populate("user", "name email")
    // .populate("branch", "name");

    res.status(200).json({
      success: true,
      count: forms.length,
      data: forms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get enrollment forms by user
exports.getEnrollmentFormsByUser = async (req, res) => {
  try {
    const form = await IESForm.find({ user: req.params.id });

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get enrollment forms by user
exports.getEnrollmentFormByEnrollmentForm = async (req, res) => {
  try {
    const form = await IESForm.find({ enrollmentForm: req.params.id });

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single enrollment form by ID
exports.getEnrollmentFormById = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await IESForm.findById(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Enrollment form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update an enrollment form
exports.updateEnrollmentForm = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await IESForm.findById(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Enrollment form not found",
      });
    }

    // Check if the user is the owner of the form or has admin privileges
    if (
      form.user.toString() !== req.user.id &&
      req.user.role !== "L1" &&
      req.user.role !== "L2"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this form",
      });
    }

    const updatedForm = await IESForm.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Enrollment form updated successfully",
      data: updatedForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update enrollment form status (approve/reject)
exports.updateFormStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await IESForm.findByIdAndUpdate(id, req.body);

    res.status(200).json({
      success: true,
      message: `Enrollment form signed  successfully`,
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete an enrollment form
exports.deleteEnrollmentForm = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await IESForm.findById(id);

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Enrollment form not found",
      });
    }

    // Check if the user is the owner of the form or has admin privileges
    if (form.user.toString() !== req.user.id && req.user.role !== "L1") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this form",
      });
    }

    await IESForm.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Enrollment form deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
