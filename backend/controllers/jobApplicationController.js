const JobApplication = require("../models/JobApplication");
const User = require("../models/User");

// Create a job application
exports.createJobApplication = async (req, res) => {
  try {
    // Create a new application with the request body
    const newApplication = new JobApplication({
      ...req.body,
      user: req.user.id,
    });

    // Save the application to the database
    const savedApplication = await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: savedApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all job applications (admin only)
exports.getAllJobApplications = async (req, res) => {
  try {
    // Add filtering options
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.position) {
      filter.position = req.query.position;
    }

    const applications = await JobApplication.find(filter)
      .populate("user", "name email")
      .populate("branch", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get job applications by branch
exports.getJobApplicationsByBranch = async (req, res) => {
  const { branchId } = req.params;

  try {
    const applications = await JobApplication.find({ branch: branchId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get job applications by user
exports.getJobApplicationsByUser = async (req, res) => {
  const userId = req.params.userId || req.user.id;

  try {
    const application = await JobApplication.find({ user: userId });

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get a single job application by ID
exports.getJobApplicationById = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await JobApplication.findById(id)
      .populate("user", "name email")
      .populate("branch", "name location");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    // Check authorization - only owner or admin can view details
    if (
      application.user._id.toString() !== req.user.id &&
      !["L1", "L2", "L3"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this application",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a job application
exports.updateJobApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    // Only allow user to update their own application if it's pending
    // Admins can update any application
    if (
      application.user.toString() !== req.user.id &&
      !["L1", "L2", "L3"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    // If the user is not an admin, they can only update if the status is pending
    if (
      !["L1", "L2", "L3"].includes(req.user.role) &&
      application.status !== "pending"
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot update application once it has been processed",
      });
    }

    // If it's an admin update, check for status change
    if (["L1", "L2", "L3"].includes(req.user.role) && req.body.status) {
      // Log status change
      console.log(
        `Application ${id} status changed from ${application.status} to ${req.body.status} by user ${req.user.id}`
      );
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Job application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update job application status
exports.updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (
    !["pending", "reviewing", "interviewed", "rejected", "accepted"].includes(
      status
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    // Update fields
    application.status = status;
    if (adminNotes) {
      application.adminNotes = adminNotes;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: `Job application status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Schedule an interview
exports.scheduleInterview = async (req, res) => {
  const { id } = req.params;
  const { interviewDate, interviewLocation } = req.body;

  if (!interviewDate || !interviewLocation) {
    return res.status(400).json({
      success: false,
      message: "Interview date and location are required",
    });
  }

  try {
    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    // Update interview details
    application.interviewDate = new Date(interviewDate);
    application.interviewLocation = interviewLocation;
    application.status = "interviewed";

    await application.save();

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a job application
exports.deleteJobApplication = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    // Check authorization - only owner or admin can delete
    if (application.user.toString() !== req.user.id && req.user.role !== "L1") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this application",
      });
    }

    await JobApplication.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
