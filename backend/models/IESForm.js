const mongoose = require("mongoose");

const enrolledChildSchema = new mongoose.Schema({
  name: String,
  caseNumber: String,
  headStart: { type: Boolean, default: false },
  fosterChild: { type: Boolean, default: false },
  migrant: { type: Boolean, default: false },
  runaway: { type: Boolean, default: false },
  homeless: { type: Boolean, default: false },
});

const householdMemberSchema = new mongoose.Schema({
  name: String,
  workEarnings: String,
  subsidies: String,
  subsidiesFreq: String,
  socialSecurity: String,
  otherIncome: String,
});

const centerAttendanceSchema = new mongoose.Schema({
  Sunday: { type: Boolean, default: false },
  Monday: { type: Boolean, default: false },
  Tuesday: { type: Boolean, default: false },
  Wednesday: { type: Boolean, default: false },
  Thursday: { type: Boolean, default: false },
  Friday: { type: Boolean, default: false },
  Saturday: { type: Boolean, default: false },
});

const mealsReceivedSchema = new mongoose.Schema({
  Breakfast: { type: Boolean, default: false },
  amSnack: { type: Boolean, default: false },
  Lunch: { type: Boolean, default: false },
  pmSnack: { type: Boolean, default: false },
  Supper: { type: Boolean, default: false },
  EveningSnack: { type: Boolean, default: false },
});

const ethnicitySchema = new mongoose.Schema({
  hispanic: { type: Boolean, default: false },
  nonHispanic: { type: Boolean, default: false },
});

const raceSchema = new mongoose.Schema({
  americanIndian: { type: Boolean, default: false },
  asian: { type: Boolean, default: false },
  black: { type: Boolean, default: false },
  hawaiian: { type: Boolean, default: false },
  white: { type: Boolean, default: false },
  multiracial: { type: Boolean, default: false },
});

const IESForm = new mongoose.Schema(
  {
    determiningSignature: {
      type: String,
      default: "",
    },
    determiningSignatureDate: {
      type: String,
      default: "",
    },
    confirmingSignature: {
      type: String,
      default: "",
    },
    confirmingSignatureDate: {
      type: String,
      default: "",
    },
    followUpSignature: {
      type: String,
      default: "",
    },
    followUpSignatureDate: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    enrolledChildOne: enrolledChildSchema,
    enrolledChildTwo: enrolledChildSchema,
    enrolledChildThree: enrolledChildSchema,
    enrolledChildFour: enrolledChildSchema,
    enrolledChildFive: enrolledChildSchema,
    childIncome: String,
    frequency: {
      type: String,
      enum: ["Weekly", "Bi-Weekly", "Monthly", "Annually"],
      default: "Weekly",
    },
    houseHoldMemberOne: householdMemberSchema,
    houseHoldMemberTwo: householdMemberSchema,
    houseHoldMemberThree: householdMemberSchema,
    houseHoldMemberFour: householdMemberSchema,
    houseHoldMemberFive: householdMemberSchema,
    totalHouseholdMemebers: String,
    ssn: String,
    ssnNotAvailable: { type: Boolean, default: false },
    facilityStartHours: String,
    facilityEndHours: String,
    OnlyCareProvided: { type: Boolean, default: false },
    centerAttendanceDays: centerAttendanceSchema,
    mealsReceived: mealsReceivedSchema,
    signature: String,
    printName: String,
    date: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    ethnicity: ethnicitySchema,
    race: raceSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EnrollmentForm", EnrollmentFormSchema);
