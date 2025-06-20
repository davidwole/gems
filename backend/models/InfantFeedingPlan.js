const mongoose = require("mongoose");

const formulaUpdateSchema = new mongoose.Schema({
  date: Date,
  time: String,
  amount: String,
  type: String,
});

const foodUpdateSchema = new mongoose.Schema({
  date: Date,
  time: String,
  amount: String,
});

const infantFeedingPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Basic info
    childFullName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },

    // Yes/No questions
    takeBottle: {
      type: Boolean,
      default: null,
    },
    bottleWarmed: {
      type: Boolean,
      default: null,
    },
    holdOwnBottle: {
      type: Boolean,
      default: null,
    },
    canFeedSelf: {
      type: Boolean,
      default: null,
    },
    takePacifier: {
      type: Boolean,
      default: null,
    },
    discussedSolidFoods: {
      type: Boolean,
      default: null,
    },
    holdHeadSteady: {
      type: Boolean,
      default: null,
    },
    opensInAnticipation: {
      type: Boolean,
      default: null,
    },
    closesLipsAroundSpoon: {
      type: Boolean,
      default: null,
    },
    transfersFood: {
      type: Boolean,
      default: null,
    },

    // "Does the child eat" checkboxes
    eatStrainedFoods: {
      type: Boolean,
      default: false,
    },
    eatWholeMilk: {
      type: Boolean,
      default: false,
    },
    eatBabyFood: {
      type: Boolean,
      default: false,
    },
    eatTableFood: {
      type: Boolean,
      default: false,
    },
    eatFormula: {
      type: Boolean,
      default: false,
    },
    eatOther: {
      type: Boolean,
      default: false,
    },

    // Text inputs
    formulaType: {
      type: String,
      trim: true,
    },
    formulaAmountAndTime: {
      type: String,
      trim: true,
    },
    formulaDate: {
      type: Date,
    },
    pacifierWhen: {
      type: String,
      trim: true,
    },
    parentInitials: {
      type: String,
      trim: true,
    },
    solidFoodInstructions: {
      type: String,
      trim: true,
    },
    foodLikes: {
      type: String,
      trim: true,
    },
    foodDislikes: {
      type: String,
      trim: true,
    },
    allergies: {
      type: String,
      trim: true,
    },
    updatedInstructions: {
      type: String,
      trim: true,
    },
    parentSignatureDate: {
      type: Date,
    },

    // Table data
    formulaUpdates: [formulaUpdateSchema],
    foodUpdates: [foodUpdateSchema],

    signature: {
      type: String, // Base64 encoded signature
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
infantFeedingPlanSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("InfantFeedingPlan", infantFeedingPlanSchema);
