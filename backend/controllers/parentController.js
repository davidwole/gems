const User = require("../models/User");
const Document = require("../models/Document");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/documents";

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    // Accept only certain file types
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      new Error(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      )
    );
  },
}).single("file"); // 'file' is the field name from the form

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
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file too large)
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    // Extract user ID and document type from the request
    const { userId, documentType } = req.body;

    try {
      // Validate that the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Create a new document record
      const document = new Document({
        user: userId,
        documentType,
        filename: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
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
  });
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

    // Delete the file from storage
    fs.unlink(document.path, async (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }

      // Delete the document record from the database
      await Document.findByIdAndDelete(documentId);

      return res.status(200).json({
        success: true,
        message: "Document deleted successfully",
      });
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
