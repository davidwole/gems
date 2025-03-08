// applicantRoutes.js - Create a new file for these routes

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Configure storage for ID uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/applicant-ids/");
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Only JPEG, PNG or PDF files are allowed!");
    }
  },
});

// I9 Form submission
router.post("/submit-i9", auth, async (req, res) => {
  try {
    // In a real implementation, you would save all the I9 form data
    // This is simplified for demonstration purposes
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "L6" || user.status !== "applicant") {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    // Update the user's I9 task status
    user.tasks.i9Completed = true;

    // Check if all tasks are complete
    if (
      user.tasks.i9Completed &&
      user.tasks.idUploaded &&
      user.tasks.handbookSigned
    ) {
      user.applicationComplete = true;
    }

    await user.save();

    res.json({
      msg: "I9 form submitted successfully",
      tasksComplete: user.applicationComplete,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Upload ID
router.post(
  "/upload-id",
  auth,
  upload.single("idDocument"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (user.role !== "L6" || user.status !== "applicant") {
        return res.status(403).json({ msg: "Unauthorized access" });
      }

      // Update user with ID document info
      user.idDocument = {
        filename: req.file.filename,
        path: req.file.path,
        uploadedAt: Date.now(),
      };

      user.tasks.idUploaded = true;

      // Check if all tasks are complete
      if (
        user.tasks.i9Completed &&
        user.tasks.idUploaded &&
        user.tasks.handbookSigned
      ) {
        user.applicationComplete = true;
      }

      await user.save();

      res.json({
        msg: "ID uploaded successfully",
        tasksComplete: user.applicationComplete,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Sign handbook
router.post("/sign-handbook", auth, async (req, res) => {
  const { branchId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "L6" || user.status !== "applicant") {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    // Verify that the branch matches
    if (user.branch.toString() !== branchId) {
      return res.status(400).json({ msg: "Branch mismatch" });
    }

    // Update handbook acknowledgement
    user.handbookAcknowledgement = {
      signed: true,
      signedAt: Date.now(),
    };

    user.tasks.handbookSigned = true;

    // Check if all tasks are complete
    if (
      user.tasks.i9Completed &&
      user.tasks.idUploaded &&
      user.tasks.handbookSigned
    ) {
      user.applicationComplete = true;
    }

    await user.save();

    res.json({
      msg: "Handbook acknowledgement signed",
      tasksComplete: user.applicationComplete,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
