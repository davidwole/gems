const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
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
    url: {
      type: String,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: [
        "Birth Certificate",
        "Medical Records",
        "School Records",
        "Immunization Records",
        "Other",
      ],
    },
    filename: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Only allow image mimetypes
          return /^image\/(jpeg|jpg|png|gif|webp)$/i.test(v);
        },
        message: "Only image files are allowed",
      },
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
