const mongoose = require("mongoose");

const safeSleepSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrollmentForm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EnrollmentForm",
      required: true,
    },
    childName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    bedding: {
      type: String,
      trim: true,
    },
    signature: {
      type: String, // Base64 encoded signature
      required: true,
    },
    signatureDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
safeSleepSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SafeSleep", safeSleepSchema);
