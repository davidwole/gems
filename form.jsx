import "../../styles/enrollmentForm.css";
import { useState } from "react";
import SignaturePad from "../../components/SignaturePad";

export default function EnrollmentForm() {
  const [formData, setFormData] = useState({
    // Basic child info
    childName: "",
    dateOfBirth: "",
    dateEnrolled: "",
    dateCompleted: "",

    // Admin section
    directorName: "",
    directorSignature: "",

    // Enrollment application
    entranceDate: "",
    withdrawalDate: "",
    gender: "",
    isMale: false,
    isFemale: false,
    age: "",

    // Sponsor information
    sponsorName: "",
    sponsorAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    sponsorCellPhone: "",
    sponsorWorkPhone: "",
    sponsorEmail: "",
    sponsorEmployer: "",
    sponsorEmployerAddress: "",
    sponsorEmployerPhone: "",

    // Co-sponsor information
    coSponsorName: "",
    coSponsorAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    coSponsorCellPhone: "",
    coSponsorWorkPhone: "",
    coSponsorEmail: "",

    // Living arrangements and guardianship
    livingArrangements: "",
    legalGuardian: "",

    // Authorization to release child
    authorizedPersons: [
      {
        name: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
        phone: "",
        alternatePhone: "",
        relationshipToChild: "",
      },
      {
        name: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
        phone: "",
        alternatePhone: "",
        relationshipToChild: "",
      },
      {
        name: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
        phone: "",
        alternatePhone: "",
        relationshipToChild: "",
      },
    ],

    // Emergency contact
    emergencyContact: {
      name: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      phone: "",
      alternatePhone: "",
      relationshipToChild: "",
    },

    // School information
    schoolInfo: {
      name: "",
      address: "",
      phone: "",
      teacherName: "",
    },

    // Parent agreement
    parentAgreementSignature: "",
    parentAgreementDate: "",

    // Emergency medical authorization
    emergencyMedicalChildName: "",
    emergencyMedicalDOB: "",
    primaryHealthCare: "",
    physicianName: "",
    physicianPhone: "",
    medicalConditions: ["", "", "", "", "", ""],
    parentGuardianSignature: "",
    signatureDate: "",
    phoneNumbers: {
      home: "",
      work: "",
      cell: "",
    },

    // Physician information
    doctorName: "",
    doctorAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    doctorPhone: "",
    specialAccommodations: "",
    allergies: "",
    takesRoutineMedication: "",
    medicationExplanation: "",

    // Transportation agreement
    transportChildName: "",
    transportFrom: "",
    transportFromTime: "",
    transportFromAMPM: "",
    transportTo: "",
    transportToTime: "",
    transportToAMPM: "",
    transportChildFrom: "",
    transportChildFromTime: "",
    transportChildFromAMPM: "",
    transportChildTo: "",
    transportChildToTime: "",
    transportChildToAMPM: "",
    transportDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
    },
    authorizedReceiver: "",
    alternatePickupProcedures: "",
    distanceInMiles: "",
    transportParentSignature: "",
    transportSignatureDate: "",

    // Vehicle emergency info
    vehicleChildName: "",
    vehicleChildDOB: "",
    vehicleAddress: "",
    vehicleCity: "",
    vehicleState: "",
    vehicleZip: "",
    vehicleHomePhone: "",
    vehicleWorkPhone: "",
    vehicleCellPhone: "",
    vehicleEmail: "",
    motherName: "",
    motherWorkPhone: "",
    motherCellPhone: "",
    motherEmail: "",
    fatherName: "",
    fatherWorkPhone: "",
    fatherCellPhone: "",
    fatherEmail: "",

    // Emergency non-parent contact
    emergencyNonParentName: "",
    emergencyNonParentPhone: "",
    childDoctor: "",
    childDoctorPhone: "",
    childAllergies: "",
    currentPrescribedMedication: "",
    childSpecialNeeds: "",
    emergencyChildName: "",
    emergencyParentSignature: "",
    emergencyWitness: "",
    emergencyWitnessDate: "",

    // Allergy statement
    allergyChildName: "",
    allergyParentName: "",
    natureOfAllergy: "",
    allergicFoods: ["", "", ""],
    substituteFoods: ["", "", ""],
    healthcarePractitionerName: "",
    healthcarePractitionerTitle: "",
    healthcareProviderSignature: "",
    healthcareProviderDate: "",
  });

  // Handle input changes for simple fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle checkbox inputs
      if (name.startsWith("transportDays.")) {
        const day = name.split(".")[1];
        setFormData({
          ...formData,
          transportDays: {
            ...formData.transportDays,
            [day]: checked,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked,
        });
      }
    } else if (type === "radio") {
      // Handle radio inputs
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      // Handle regular text inputs
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle nested object changes
  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  // Handle address changes
  const handleAddressChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        address: {
          ...formData[section].address,
          [field]: value,
        },
      },
    });
  };

  // Handle authorized persons changes
  const handleAuthorizedPersonChange = (index, field, value) => {
    const updatedAuthorizedPersons = [...formData.authorizedPersons];
    updatedAuthorizedPersons[index] = {
      ...updatedAuthorizedPersons[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      authorizedPersons: updatedAuthorizedPersons,
    });
  };

  // Handle authorized person address changes
  const handleAuthorizedPersonAddressChange = (index, field, value) => {
    const updatedAuthorizedPersons = [...formData.authorizedPersons];
    updatedAuthorizedPersons[index] = {
      ...updatedAuthorizedPersons[index],
      address: {
        ...updatedAuthorizedPersons[index].address,
        [field]: value,
      },
    };

    setFormData({
      ...formData,
      authorizedPersons: updatedAuthorizedPersons,
    });
  };

  // Handle medical conditions array changes
  const handleMedicalConditionChange = (index, value) => {
    const updatedMedicalConditions = [...formData.medicalConditions];
    updatedMedicalConditions[index] = value;

    setFormData({
      ...formData,
      medicalConditions: updatedMedicalConditions,
    });
  };

  // Handle allergic foods and substitute foods changes
  const handleFoodArrayChange = (arrayName, index, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = value;

    setFormData({
      ...formData,
      [arrayName]: updatedArray,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission
    console.log("Form submitted with data:", formData);
    // Here you would typically send the data to your server
  };

  return (
    <>
      <form></form>
      <div className="flex input_spacer_med">
            <label>Sponsor's Name:</label>
            <input
              type="text"
              name="sponsorName"
              value={formData.sponsorName}
              onChange={handleChange}
            />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input
                type="text"
                name="sponsorAddress.street"
                value={formData.sponsorAddress.street}
                onChange={(e) =>
                  handleAddressChange(
                    "sponsorAddress",
                    "street",
                    e.target.value
                  )
                }
              />
              <label>Number Street</label>
            </div>
            <div>
              <input
                type="text"
                name="sponsorAddress.city"
                value={formData.sponsorAddress.city}
                onChange={(e) =>
                  handleAddressChange("sponsorAddress", "city", e.target.value)
                }
              />
              <label>City</label>
            </div>
            <div>
              <input
                type="text"
                name="sponsorAddress.state"
                value={formData.sponsorAddress.state}
                onChange={(e) =>
                  handleAddressChange("sponsorAddress", "state", e.target.value)
                }
              />
              <label>State</label>
            </div>
            <div>
              <input
                type="text"
                name="sponsorAddress.zipCode"
                value={formData.sponsorAddress.zipCode}
                onChange={(e) =>
                  handleAddressChange(
                    "sponsorAddress",
                    "zipCode",
                    e.target.value
                  )
                }
              />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Cell Phone:</label>
            <input
              type="text"
              name="sponsorCellPhone"
              value={formData.sponsorCellPhone}
              onChange={handleChange}
            />
            <label>Work Phone:</label>
            <input
              type="text"
              name="sponsorWorkPhone"
              value={formData.sponsorWorkPhone}
              onChange={handleChange}
            />
          </div>
          <div className="flex input_spacer_med">
            <label>Email address:</label>
            <input
              type="text"
              name="sponsorEmail"
              value={formData.sponsorEmail}
              onChange={handleChange}
            />
          </div>
          <div className="flex input_spacer_med">
            <label>Employer:</label>
            <input
              type="text"
              name="sponsorEmployer"
              value={formData.sponsorEmployer}
              onChange={handleChange}
            />
          </div>
          <div className="flex input_spacer_med">
            <label>Address:</label>
            <input
              type="text"
              name="sponsorEmployerAddress"
              value={formData.sponsorEmployerAddress}
              onChange={handleChange}
            />

            <label>Phone:</label>
            <input
              type="text"
              name="sponsorEmployerPhone"
              value={formData.sponsorEmployerPhone}
              onChange={handleChange}
            />
          </div>
          <div className="flex input_spacer_med">
            <label>Co Sponsor's Name:</label>
            <input
              type="text"
              name="coSponsorName"
              value={formData.coSponsorName}
              onChange={handleChange}
            />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input
                type="text"
                name="coSponsorAddress.street"
                value={formData.coSponsorAddress.street}
                onChange={(e) =>
                  handleAddressChange(
                    "coSponsorAddress",
                    "street",
                    e.target.value
                  )
                }
              />
              <label>Number Street</label>
            </div>
            <div>
              <input
                type="text"
                name="coSponsorAddress.city"
                value={formData.coSponsorAddress.city}
                onChange={(e) =>
                  handleAddressChange(
                    "coSponsorAddress",
                    "city",
                    e.target.value
                  )
                }
              />
              <label>City</label>
            </div>
            <div>
              <input
                type="text"
                name="coSponsorAddress.state"
                value={formData.coSponsorAddress.state}
                onChange={(e) =>
                  handleAddressChange(
                    "coSponsorAddress",
                    "state",
                    e.target.value
                  )
                }
              />
              <label>State</label>
            </div>
            <div>
              <input
                type="text"
                name="coSponsorAddress.zipCode"
                value={formData.coSponsorAddress.zipCode}
                onChange={(e) =>
                  handleAddressChange(
                    "coSponsorAddress",
                    "zipCode",
                    e.target.value
                  )
                }
              />
              <label>Zip Code</label>
            </div>
          </div>
          <div className="flex input_spacer_med">
            <label>Cell Phone:</label>
            <input
              type="text"
              name="coSponsorCellPhone"
              value={formData.coSponsorCellPhone}
              onChange={handleChange}
            />
            <label>Work Phone:</label>
            <input
              type="text"
              name="coSponsorWorkPhone"
              value={formData.coSponsorWorkPhone}
              onChange={handleChange}
            />
          </div>
          <div className="flex input_spacer_med">
            <label>Email address:</label>
            <input
              type="text"
              name="coSponsorEmail"
              value={formData.coSponsorEmail}
              onChange={handleChange}
            />
          </div>
          <div className="flex input_spacer_med">
            <p>Child's Living Arrangements:</p>
            <label>
              <input
                type="radio"
                name="livingArrangements"
                value="both_parents"
                checked={formData.livingArrangements === "both_parents"}
                onChange={handleChange}
              />{" "}
              Both Parents
            </label>
            <label>
              <input
                type="radio"
                name="livingArrangements"
                value="mother"
                checked={formData.livingArrangements === "mother"}
                onChange={handleChange}
              />{" "}
              Mother
            </label>
            <label>
              <input
                type="radio"
                name="livingArrangements"
                value="father"
                checked={formData.livingArrangements === "father"}
                onChange={handleChange}
              />{" "}
              Father
            </label>
            <label>
              <input
                type="radio"
                name="livingArrangements"
                value="other"
                checked={formData.livingArrangements === "other"}
                onChange={handleChange}
              />{" "}
              Other
            </label>
          </div>
          <div className="flex input_spacer_med">
            <p>Child's Legal Guardian:</p>
            <label>
              <input
                type="radio"
                name="legalGuardian"
                value="both_parents"
                checked={formData.legalGuardian === "both_parents"}
                onChange={handleChange}
              />{" "}
              Both Parents
            </label>
            <label>
              <input
                type="radio"
                name="legalGuardian"
                value="mother"
                checked={formData.legalGuardian === "mother"}
                onChange={handleChange}
              />{" "}
              Mother
            </label>
            <label>
              <input
                type="radio"
                name="legalGuardian"
                value="father"
                checked={formData.legalGuardian === "father"}
                onChange={handleChange}
              />{" "}
              Father
            </label>
            <label>
              <input
                type="radio"
                name="legalGuardian"
                value="other"
                checked={formData.legalGuardian === "other"}
                onChange={handleChange}
              />{" "}
              Other
            </label>
          </div>
        </div>

        <div className="flex input_spacer_med">
          <label>Name:</label>
          <input
            type="text"
            name="authorizedPersons[0].name"
            value={formData.authorizedPersons[0].name}
            onChange={(e) =>
              handleAuthorizedPersonChange(0, "name", e.target.value)
            }
          />
        </div>
        <div className="addressbar">
          <label>Address:</label>
          <div>
            <input
              type="text"
              name="authorizedPersons[0].address.street"
              value={formData.authorizedPersons[0].address.street}
              onChange={(e) =>
                handleAuthorizedPersonAddressChange(0, "street", e.target.value)
              }
            />
            <label>Number Street</label>
          </div>
          <div>
            <input
              type="text"
              name="authorizedPersons[0].address.city"
              value={formData.authorizedPersons[0].address.city}
              onChange={(e) =>
                handleAuthorizedPersonAddressChange(0, "city", e.target.value)
              }
            />
            <label>City</label>
          </div>
          <div>
            <input
              type="text"
              name="authorizedPersons[0].address.state"
              value={formData.authorizedPersons[0].address.state}
              onChange={(e) =>
                handleAuthorizedPersonAddressChange(0, "state", e.target.value)
              }
            />
            <label>State</label>
          </div>
          <div>
            <input
              type="text"
              name="authorizedPersons[0].address.zipCode"
              value={formData.authorizedPersons[0].address.zipCode}
              onChange={(e) =>
                handleAuthorizedPersonAddressChange(
                  0,
                  "zipCode",
                  e.target.value
                )
              }
            />
            <label>Zip Code</label>
          </div>
        </div>
        <div className="flex input_spacer_med">
          <label>Phone:</label>
          <input
            type="text"
            name="authorizedPersons[0].phone"
            value={formData.authorizedPersons[0].phone}
            onChange={(e) =>
              handleAuthorizedPersonChange(0, "phone", e.target.value)
            }
          />

          <label>Alternate Phone:</label>
          <input
            type="text"
            name="authorizedPersons[0].alternatePhone"
            value={formData.authorizedPersons[0].alternatePhone}
            onChange={(e) =>
              handleAuthorizedPersonChange(0, "alternatePhone", e.target.value)
            }
          />
        </div>
        <div className="flex input_spacer_med">
          <label>Relationship to Child/Parent</label>
          <input
            type="text"
            name="authorizedPersons[0].relationshipToChild"
            value={formData.authorizedPersons[0].relationshipToChild}
            onChange={(e) =>
              handleAuthorizedPersonChange(
                0,
                "relationshipToChild",
                e.target.value
              )
            }
          />
        </div>

    </>
  );
}
