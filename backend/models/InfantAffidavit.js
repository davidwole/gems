// models/InfantAffidavit.js
const mongoose = require("mongoose");

const parentProvidedComponentsSchema = new mongoose.Schema({
  formula: { type: Boolean, default: false },
  cereal: { type: Boolean, default: false },
  fruit: { type: Boolean, default: false },
  vegetable: { type: Boolean, default: false },
  protein: { type: Boolean, default: false },
  dairy: { type: Boolean, default: false },
  bread: { type: Boolean, default: false },
});

const infantAffidavitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sponsorName: {
      type: String,
      trim: true,
    },
    providerName: {
      type: String,
      required: true,
      trim: true,
      default: "Gems Learning Academy",
    },
    infantName: {
      type: String,
      required: true,
      trim: true,
    },
    infantDOB: {
      type: Date,
      required: true,
    },
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    formulaBrand: {
      type: String,
      trim: true,
      default: "Silmac Advance",
    },
    infantCereal: {
      type: String,
      trim: true,
      default: "Gerber Rice, Wheat, and Oatmeal",
    },
    infantFood: {
      type: String,
      trim: true,
      default: "Gerber Baby Food",
    },
    mealOption: {
      type: String,
      enum: ["provider", "parent"],
      required: true,
    },
    parentProvidedComponents: {
      type: parentProvidedComponentsSchema,
      default: () => ({}),
    },
    signature: {
      type: String, // Base64 encoded signature
      required: true,
    },
    date: {
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
infantAffidavitSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("InfantAffidavit", infantAffidavitSchema);
