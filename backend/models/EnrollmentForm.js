const mongoose = require("mongoose");

const EnrollmentFormSchema = new mongoose.Schema(
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
    // Basic child info
    childName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    dateEnrolled: { type: String, required: true },
    dateCompleted: { type: String },

    // Admin section
    directorName: String,
    directorSignature: String,

    // Enrollment application
    entranceDate: String,
    withdrawalDate: String,
    gender: {
      type: String,
      //enum: ["male", "female", "other"]
      //
    },
    age: Number,

    // Sponsor information
    sponsorName: { type: String, required: true },
    sponsorAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    sponsorCellPhone: String,
    sponsorWorkPhone: String,
    sponsorEmail: String,
    sponsorEmployer: String,
    sponsorEmployerAddress: String,
    sponsorEmployerPhone: String,

    // Co-sponsor information
    coSponsorName: String,
    coSponsorAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    coSponsorCellPhone: String,
    coSponsorWorkPhone: String,
    coSponsorEmail: String,

    // Living arrangements and guardianship
    livingArrangements: String,
    legalGuardian: String,

    // Authorization to release child
    authorizedPersons: [
      {
        name: String,
        address: {
          street: String,
          city: String,
          state: String,
          zipCode: String,
        },
        phone: String,
        alternatePhone: String,
        relationshipToChild: String,
      },
    ],

    // Emergency contact
    emergencyContact: {
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
      },
      phone: String,
      alternatePhone: String,
      relationshipToChild: String,
    },

    // School information
    schoolInfo: {
      name: String,
      address: String,
      phone: String,
      teacherName: String,
    },

    // Parent agreement
    parentAgreementSignature: String,
    parentAgreementDate: String,

    // Emergency medical authorization
    emergencyMedicalChildName: String,
    emergencyMedicalDOB: String,
    primaryHealthCare: String,
    physicianName: String,
    physicianPhone: String,
    medicalConditions: [String],
    parentGuardianSignature: String,
    signatureDate: String,
    phoneNumbers: {
      home: String,
      work: String,
      cell: String,
    },

    // Physician information
    doctorName: String,
    doctorAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    doctorPhone: String,
    specialAccommodations: String,
    allergies: String,
    takesRoutineMedication: Boolean,
    medicationExplanation: String,

    // Transportation agreement
    transportChildName: String,
    transportFrom: String,
    transportFromTime: String,
    transportFromAMPM: {
      type: String,
      //enum: ["AM", "PM"]
      //
    },
    transportTo: String,
    transportToTime: String,
    transportToAMPM: {
      type: String,
      //enum: ["AM", "PM"]
      //
    },
    transportChildFrom: String,
    transportChildFromTime: String,
    transportChildFromAMPM: {
      type: String,
      //enum: ["AM", "PM"]
      //
    },
    transportChildTo: String,
    transportChildToTime: String,
    transportChildToAMPM: {
      type: String,
      //enum: ["AM", "PM"]
      //
    },
    transportDays: {
      monday: Boolean,
      tuesday: Boolean,
      wednesday: Boolean,
      thursday: Boolean,
      friday: Boolean,
    },
    authorizedReceiver: String,
    alternatePickupProcedures: String,
    distanceInMiles: Number,
    transportParentSignature: String,
    transportSignatureDate: String,

    // Vehicle emergency info
    vehicleChildName: String,
    vehicleChildDOB: String,
    vehicleAddress: String,
    vehicleCity: String,
    vehicleState: String,
    vehicleZip: String,
    vehicleHomePhone: String,
    vehicleWorkPhone: String,
    vehicleCellPhone: String,
    vehicleEmail: String,
    motherName: String,
    motherWorkPhone: String,
    motherCellPhone: String,
    motherEmail: String,
    fatherName: String,
    fatherWorkPhone: String,
    fatherCellPhone: String,
    fatherEmail: String,

    // Emergency non-parent contact
    emergencyNonParentName: String,
    emergencyNonParentPhone: String,
    childDoctor: String,
    childDoctorPhone: String,
    childAllergies: String,
    currentPrescribedMedication: String,
    childSpecialNeeds: String,
    emergencyChildName: String,
    emergencyParentSignature: String,
    emergencyWitness: String,
    emergencyWitnessDate: String,

    // Allergy statement
    allergyChildName: String,
    allergyParentName: String,
    natureOfAllergy: String,
    allergicFoods: [String],
    substituteFoods: [String],
    healthcarePractitionerName: String,
    healthcarePractitionerTitle: String,
    healthcareProviderSignature: String,
    healthcareProviderDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EnrollmentForm", EnrollmentFormSchema);
