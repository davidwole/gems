const mongoose = require("mongoose");

const HandbookSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["employee", "parent"],
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileData: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    default: "application/pdf",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add compound index to ensure only one handbook per type per branch
HandbookSchema.index({ branch: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Handbook", HandbookSchema);
