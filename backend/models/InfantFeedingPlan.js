const mongoose = require("mongoose");

const InfantFeedingPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    // Child information
    childName: { type: String, required: true },
    dateOfBirth: { type: Date },
    formDate: { type: Date },

    // Bottle information
    takeBottle: { type: Boolean },
    bottleWarmed: { type: Boolean },
    holdOwnBottle: { type: Boolean },
    canFeedSelf: { type: Boolean },

    // Eating information
    eatingHabits: {
      strainedFoods: { type: Boolean },
      babyFood: { type: Boolean },
      formula: { type: Boolean },
      wholeMilk: { type: Boolean },
      tableFood: { type: Boolean },
      other: { type: Boolean },
    },

    // Formula details
    formulaType: { type: String },
    formulaAmount: { type: String },
    formulaSchedule: { type: String },

    // Updated formula information
    updatedFormula: [
      {
        date: { type: Date },
        time: { type: String },
        amount: { type: String },
        type: { type: String },
      },
    ],

    // Pacifier information
    takePacifier: { type: Boolean },
    pacifierTimes: { type: String },

    // Solid foods information
    discussedSolidFoods: { type: Boolean },
    parentInitials: { type: String },

    // Developmental skills
    holdHeadSteady: { type: Boolean },
    opensInAnticipation: { type: Boolean },
    closesLipsAroundSpoon: { type: Boolean },
    transfersFood: { type: Boolean },

    // Feeding instructions and preferences
    solidFoodsInstructions: { type: String },
    foodLikes: { type: String },
    foodDislikes: { type: String },
    allergies: { type: String },

    // Updated food information
    updatedFood: [
      {
        date: { type: Date },
        time: { type: String },
        amount: { type: String },
      },
    ],

    // Additional instructions
    additionalInstructions: { type: String },

    // Signature
    parentSignature: { type: String },
    signatureDate: { type: Date },

    // Status and timestamps
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InfantFeedingPlan", InfantFeedingPlanSchema);
