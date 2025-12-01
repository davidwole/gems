const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L10"],
      default: "L10",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    isSuspended: { type: Boolean, default: false },
    position: {
      type: String,
      required: function () {
        return this.role === "L6"; // Only required for applicants
      },
    },
    status: {
      type: String,
      enum: ["active", "applicant", "former"],
      default: "active",
      required: function () {
        return this.role === "L6"; // Only required for applicants
      },
    },
    applicationComplete: {
      type: Boolean,
      default: false,
      required: function () {
        return this.role === "L6"; // Only required for applicants
      },
    },
    parentHandbookSigned: {
      type: Boolean,
      default: false,
    },
    employeeHandbookSigned: {
      type: Boolean,
      default: false,
    },
    tasks: {
      i9Completed: {
        type: Boolean,
        default: false,
      },
      idUploaded: {
        type: Boolean,
        default: false,
      },
      handbookSigned: {
        type: Boolean,
        default: false,
      },
    },
    idDocument: {
      filename: String,
      path: String,
      uploadedAt: Date,
    },
    handbookAcknowledgement: {
      signed: {
        type: Boolean,
        default: false,
      },
      signedAt: Date,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
