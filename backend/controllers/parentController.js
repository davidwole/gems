const User = require("../models/User");
const Document = require("../models/Document");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// Register a new parent
exports.registerParent = async (req, res) => {
  const { name, email, password, branch, role } = req.body;

  try {
    // Check if the email is already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Ensure that the role is set to L8 (Parent)
    const parentRole = role === "L8" ? role : "L8";

    // Create the parent user
    user = new User({
      name,
      email,
      password,
      branch,
      role: parentRole,
      status: "active", // Parents are immediately active
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        role: user.role,
        branch: user.branch,
        isSuspended: user.isSuspended,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Give them a week to complete the application
    );

    res.status(201).json({
      message: "Parent registration successful",
      token,
    });
  } catch (error) {
    console.error("Parent registration error:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

exports.uploadChildDocuments = async (req, res) => {
  try {
    // Extract document data from the request body
    const {
      user: userId,
      enrollmentForm,
      url,
      documentType,
      filename,
      mimetype,
      size,
    } = req.body;

    // Validate required fields
    if (!userId || !enrollmentForm || !url || !documentType || !filename) {
      return res.status(400).json({
        success: false,
        message: "Missing required document information",
      });
    }

    // // Validate that the user exists
    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    // Validate mimetype is an image
    if (!mimetype || !/^image\/(jpeg|jpg|png|gif|webp)$/i.test(mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed",
      });
    }

    // Create a new document record with the provided URL
    const document = new Document({
      user: userId,
      enrollmentForm: enrollmentForm,
      url: url,
      documentType,
      filename: filename,
      mimetype: mimetype,
      size: size || 0,
    });

    // Save the document to the database
    await document.save();

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document._id,
        filename: document.filename,
        documentType: document.documentType,
        url: document.url,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during document upload",
      error: error.message,
    });
  }
};

// Get all documents for a specific user
exports.getUserDocuments = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all documents for the specified user
    const documents = await Document.find({ user: userId });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching documents",
      error: error.message,
    });
  }
};

// Get document by ID (returns the URL for viewing)
exports.getDocumentFile = async (req, res) => {
  try {
    const documentId = req.params.documentId;

    // Find the document
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Return the document URL and metadata
    return res.status(200).json({
      success: true,
      document: {
        id: document._id,
        filename: document.filename,
        documentType: document.documentType,
        url: document.url,
        uploadedAt: document.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching document",
      error: error.message,
    });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const documentId = req.params.documentId;

    // Find the document
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Check if user is authorized to delete this document
    if (document.user.toString() !== req.user.id && req.user.role !== "L1") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this document",
      });
    }

    // Note: You might want to also delete the image from the external service
    // This depends on your external API's capabilities

    // Delete the document record from the database
    await Document.findByIdAndDelete(documentId);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting document",
      error: error.message,
    });
  }
};
