const mongoose = require("mongoose");

// Education schema
const educationSchema = new mongoose.Schema({
  schoolName: String,
  address: String,
  fromDate: String,
  toDate: String,
  graduated: { type: Boolean, default: false },
  degree: String,
});

// Previous employment schema
const previousEmploymentSchema = new mongoose.Schema({
  company: String,
  phone: String,
  address: String,
  supervisor: String,
  jobTitle: String,
  startingSalary: String,
  endingSalary: String,
  responsibilities: String,
  fromDate: String,
  toDate: String,
  reasonForLeaving: String,
  canContact: { type: Boolean, default: false },
});

// Reference schema
const referenceSchema = new mongoose.Schema({
  fullName: String,
  relationship: String,
  company: String,
  phone: String,
  address: String,
});

// Military service schema
const militaryServiceSchema = new mongoose.Schema({
  branch: String,
  fromDate: String,
  toDate: String,
  rankAtDischarge: String,
  dischargeType: String,
  dischargeExplanation: String,
});

// Questionnaire schema
const questionnaireSchema = new mongoose.Schema({
  importantToolForChildren: [String],
  feelingsAboutYelling: [String],
  handlingConflicts: [String],
  negativeAttitude: [String],
  reasonToWorkInChildcare: [String],
  greetingParentsAndChildren: [String],
  praisingChildren: [String],
  disciplineMessage: [String],
  tellingChildIsBad: [String],
  enjoymentFromWorkingWithChildren: [String],
  hasHeldChildcareLicense: { type: Boolean, default: false },
  enjoymentFromWorkingWithChildrenTwo: [String],
});

const JobApplicationSchema = new mongoose.Schema(
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
    // Applicant Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: String,
    date: String,

    // Address Information
    streetAddress: String,
    apartmentUnit: String,
    city: String,
    state: String,
    zipCode: String,

    // Permanent/Secondary Address
    streetAddressTwo: String,
    apartmentUnitTwo: String,
    cityTwo: String,
    stateTwo: String,
    zipCodeTwo: String,

    // Contact Information
    phone: String,
    email: { type: String, required: true },

    // Job Details
    dateAvailable: String,
    desiredSalary: String,
    position: String,

    // Citizenship & Work Status
    isUsCitizen: { type: Boolean, default: false },
    isAuthorizedToWork: { type: Boolean, default: false },

    // Previous Employment with Company
    hasWorkedForCompany: { type: Boolean, default: false },
    previousEmploymentDate: String,

    // Hours Sought
    hoursPreference: {
      type: String,
      enum: ["fullTime", "partTime", "anyHours"],
    },

    // Current Employment
    isCurrentlyEmployed: { type: Boolean, default: false },
    canContactCurrentEmployer: { type: Boolean, default: false },

    // Criminal History
    hasBeenConvictedOfFelony: { type: Boolean, default: false },
    felonyExplanation: String,

    // Education
    education: [educationSchema],

    // Criminal History Details
    canContactPreviousEmployers: { type: Boolean, default: false },
    hasCriminalRecord: { type: Boolean, default: false },
    criminalRecordExplanation: String,
    hasAbusedOrNeglected: { type: Boolean, default: false },
    abuseExplanation: String,
    canPerformDuties: { type: Boolean, default: false },
    inabilityExplanation: String,
    willSubmitToBackgroundCheck: { type: Boolean, default: false },
    willSubmitToFingerprintCheck: { type: Boolean, default: false },
    hasValidDriversLicense: { type: Boolean, default: false },
    hasCprTraining: { type: Boolean, default: false },
    hasBeenDisciplined: { type: Boolean, default: false },
    disciplinaryExplanation: [String],

    // Employment History
    previousEmployment: [previousEmploymentSchema],

    // Questionnaire
    questionnaire: questionnaireSchema,

    // References
    references: [referenceSchema],

    // Military Service
    militaryService: militaryServiceSchema,

    // Signature
    signature: String,
    signatureDate: String,

    // Application Status
    status: {
      type: String,
      enum: ["pending", "reviewing", "interviewed", "rejected", "accepted"],
      default: "pending",
    },

    // Admin notes
    adminNotes: String,

    // Interview scheduling
    interviewDate: Date,
    interviewLocation: String,

    // Document uploads
    documents: [
      {
        name: String,
        path: String,
        uploadedAt: Date,
      },
    ],
    interviewNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
