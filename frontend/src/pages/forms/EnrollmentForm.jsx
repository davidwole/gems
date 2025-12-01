import "../../styles/enrollmentForm.css";
import { useState, useContext, useEffect, useRef } from "react";
import SignaturePad from "../../components/SignaturePad";
import { AuthContext } from "../../context/AuthContext";
import { submitEnrollmentForm } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function EnrollmentForm() {
  const { user } = useContext(AuthContext);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [error, setError] = useState(false);
  const errorRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: user?.id,
    branch: user?.branch,
    // Basic child info
    childName: "",
    dateOfBirth: "",
    dateEnrolled: "",
    dateCompleted: "",
    parentSignature: "",

    // Admin section
    directorName: "",
    directorSignature: "",

    // Enrollment application
    entranceDate: "",
    withdrawalDate: "",
    gender: "",
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
    takesRoutineMedication: false,
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

  const handleCheckboxChange = (selectedGender) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      gender: prevFormData.gender === selectedGender ? "" : selectedGender,
    }));
  };

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

  // For directly modifying address objects (like sponsorAddress)
  const handleAddressChange = (section, field, value) => {
    // Check if section is an address object itself or contains an address object
    if (section.includes("Address")) {
      // Direct address object (e.g., sponsorAddress)
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      // Nested address object (e.g., emergencyContact.address)
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
    }
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

  // Generic handler for all signature fields
  const handleSignatureChange = (field, signatureData) => {
    // Only update if the signature has actually changed
    if (formData[field] !== signatureData) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: signatureData,
      }));
    }
  };

  const errorHandler = (message) => {
    setError(message);
    setTimeout(() => {
      setError(false);
    }, 3800);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    setSubmitSuccess(true);
    e.preventDefault();
    try {
      const missingSignatures = [
        "parentSignature",
        "directorSignature",
        "parentAgreementSignature",
        "parentGuardianSignature",
        "emergencyParentSignature",
        "transportParentSignature",
        "healthcareProviderSignature",
      ].filter((sig) => !formData[sig]);

      if (missingSignatures.length > 0) {
        errorHandler("All signatures required");

        // Scroll to the error message
        if (errorRef.current) {
          errorRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }

        setSubmitSuccess(false);

        return;
      }

      const result = await submitEnrollmentForm(formData);
      if (result.success) {
        setSubmitSuccess(true);
        // Redirect to dashboard after 3 seconds
        alert("Form submitted successfully");
        navigate("/dashboard");
      }
      // Process form submission
      setSubmitSuccess(false);
      console.log("Form submitted with data:", formData);
      // Here you would typically send the data to your server
    } catch (error) {
      errorHandler(error.message);
      setSubmitSuccess(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        user: user.id,
        branch: user.branch,
      }));
    }
  }, [user]);

  // This memoizes the signature handlers to prevent unnecessary re-renders
  useEffect(() => {
    // Nothing to do here, but the dependency array ensures the handlers are stable
  }, []);

  const handleParentSignature = (signatureData) => {
    handleSignatureChange("parentSignature", signatureData);
  };

  const handleDirectorSignature = (signatureData) => {
    handleSignatureChange("directorSignature", signatureData);
  };

  const handleParentAgreementSignature = (signatureData) => {
    handleSignatureChange("parentAgreementSignature", signatureData);
  };

  const handleParentGuardianSignature = (signatureData) => {
    handleSignatureChange("parentGuardianSignature", signatureData);
  };

  const handleTransportParentSignature = (signatureData) => {
    handleSignatureChange("transportParentSignature", signatureData);
  };

  const handleEmergencyParentSignature = (signatureData) => {
    handleSignatureChange("emergencyParentSignature", signatureData);
  };

  const handleEmergencyWitnessSignature = (signatureData) => {
    handleSignatureChange("emergencyWitness", signatureData);
  };

  const handleHealthcareProviderSignature = (signatureData) => {
    handleSignatureChange("healthcareProviderSignature", signatureData);
  };

  return (
    <>
      {error && (
        <div className="errors" ref={errorRef}>
          <p>{error}</p>
        </div>
      )}
      <div className="enrollment_form">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex spacer_lg">
            <label>Child's Name:</label>
            <input
              type="text"
              className="flex_width"
              name="childName"
              value={formData.childName}
              onChange={handleChange}
            />
          </div>
          <div className="flex spacer_lg">
            <label>Date of Birth:</label>
            <input
              type="date"
              className="flex_width"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />

            <label>Date Enrolled:</label>
            <input
              type="date"
              className="flex_width"
              name="dateEnrolled"
              value={formData.dateEnrolled}
              onChange={handleChange}
            />
          </div>
          <div className="checklist">
            <h5 className="text_align_center">GEMS Enrollment Application</h5>
            <h5 className="text_align_center">2025 Check List</h5>

            <h5 className="text_align_center">
              For all children, please fill out the following and return at
              least 2 working days before the Start Date for your child.
            </h5>

            <div className="centered-list">
              <ul>
                <li className="custom-bullet">Emergency Medical Form</li>
                <li className="custom-bullet">Parental Agreement</li>
                <li className="custom-bullet">
                  Allergy Statement (Allergies must be noted during enrollment)
                </li>
                <li className="custom-bullet">Emergency Contact List</li>
                <li className="custom-bullet">
                  Authorized persons pickup list
                </li>
                <li className="custom-bullet">
                  Copy of Guardians Identification
                </li>
                <li className="custom-bullet">All USDA forms</li>
                <li className="custom-bullet">Form 3231 and Form 3300</li>
                <li className="custom-bullet">
                  Parent Handbook (emailed upon enrollment)
                </li>
              </ul>
            </div>

            <h5 className="text_align_center prek_text">
              GA PreK enrollment has additional requirements, please see the
              front desk for GA PreK enrollment paperwork.
            </h5>
          </div>
          <div className="date_comp_sign align_center input_spacer_med">
            <div>
              <label>Date Completed:</label>
              <input
                type="date"
                className="short_input"
                name="dateCompleted"
                value={formData.dateCompleted}
                onChange={handleChange}
              />
            </div>

            <div>
              <SignaturePad
                label="Parent Signature"
                onSignatureChange={handleParentSignature}
              />
            </div>
          </div>
          <div className="flex align_center input_spacer_med">
            <label className="margin_right_small">
              Reviewed by Director/Admin:
            </label>
            <div className="director_review">
              <div className="flex column">
                <input
                  type="text"
                  name="directorName"
                  value={formData.directorName}
                  onChange={handleChange}
                />
                <label>Print Name</label>
              </div>

              <div className="flex column">
                <SignaturePad onSignatureChange={handleDirectorSignature} />
                {/* <input
                type="text"
                name="directorSignature"
                value={formData.directorSignature}
                onChange={handleChange}
              />
              <label>Signature</label> */}
              </div>
            </div>
          </div>
          <div className="enrollemnt_app_container">
            <h5 className="spacer_lg">
              Enrollment Application (Please Print Clearly)
            </h5>
            <div className="flex input_spacer_med">
              <label>Entrance Date:</label>
              <input
                type="date"
                name="entranceDate"
                value={formData.entranceDate}
                onChange={handleChange}
              />

              <label>Withdrawal Date:</label>
              <input
                type="date"
                name="withdrawalDate"
                value={formData.withdrawalDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex input_spacer_med">
              <label>Child's Name:</label>
              <input
                type="text"
                name="childName"
                value={formData.childName}
                onChange={handleChange}
              />
            </div>
            <div className="gender_field">
              <label>Gender:</label>

              <label>
                Male
                <input
                  type="checkbox"
                  checked={formData.gender === "Male"}
                  onChange={() => handleCheckboxChange("Male")}
                />
              </label>

              <label>
                Female
                <input
                  type="checkbox"
                  checked={formData.gender === "Female"}
                  onChange={() => handleCheckboxChange("Female")}
                />
              </label>

              <label>Age</label>
              <input
                type="text"
                style={{ width: "5rem" }}
                name="age"
                value={formData.age}
                onChange={handleChange}
              />

              <label>Date of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                // onChange={handleChange}
              />
            </div>
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
                    handleAddressChange(
                      "sponsorAddress",
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
                  name="sponsorAddress.state"
                  value={formData.sponsorAddress.state}
                  onChange={(e) =>
                    handleAddressChange(
                      "sponsorAddress",
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
                  handleAuthorizedPersonAddressChange(
                    0,
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
                  handleAuthorizedPersonAddressChange(
                    0,
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
                handleAuthorizedPersonChange(
                  0,
                  "alternatePhone",
                  e.target.value
                )
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

          <div className="flex input_spacer_med">
            <label>Name:</label>
            <input
              type="text"
              name="authorizedPersons[1].name"
              value={formData.authorizedPersons[1].name}
              onChange={(e) =>
                handleAuthorizedPersonChange(1, "name", e.target.value)
              }
            />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input
                type="text"
                name="authorizedPersons[1].address.street"
                value={formData.authorizedPersons[1].address.street}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(
                    1,
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
                name="authorizedPersons[1].address.city"
                value={formData.authorizedPersons[1].address.city}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(1, "city", e.target.value)
                }
              />
              <label>City</label>
            </div>
            <div>
              <input
                type="text"
                name="authorizedPersons[1].address.state"
                value={formData.authorizedPersons[1].address.state}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(
                    1,
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
                name="authorizedPersons[1].address.zipCode"
                value={formData.authorizedPersons[1].address.zipCode}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(
                    1,
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
              name="authorizedPersons[1].phone"
              value={formData.authorizedPersons[1].phone}
              onChange={(e) =>
                handleAuthorizedPersonChange(1, "phone", e.target.value)
              }
            />

            <label>Alternate Phone:</label>
            <input
              type="text"
              name="authorizedPersons[1].alternatePhone"
              value={formData.authorizedPersons[1].alternatePhone}
              onChange={(e) =>
                handleAuthorizedPersonChange(
                  1,
                  "alternatePhone",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex input_spacer_med">
            <label>Relationship to Child/Parent</label>
            <input
              type="text"
              name="authorizedPersons[1].relationshipToChild"
              value={formData.authorizedPersons[1].relationshipToChild}
              onChange={(e) =>
                handleAuthorizedPersonChange(
                  1,
                  "relationshipToChild",
                  e.target.value
                )
              }
            />
          </div>

          <div className="flex input_spacer_med">
            <label>Name:</label>
            <input
              type="text"
              name="authorizedPersons[2].name"
              value={formData.authorizedPersons[2].name}
              onChange={(e) =>
                handleAuthorizedPersonChange(2, "name", e.target.value)
              }
            />
          </div>
          <div className="addressbar">
            <label>Address:</label>
            <div>
              <input
                type="text"
                name="authorizedPersons[2].address.street"
                value={formData.authorizedPersons[2].address.street}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(
                    2,
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
                name="authorizedPersons[2].address.city"
                value={formData.authorizedPersons[2].address.city}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(2, "city", e.target.value)
                }
              />
              <label>City</label>
            </div>
            <div>
              <input
                type="text"
                name="authorizedPersons[2].address.state"
                value={formData.authorizedPersons[2].address.state}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(
                    2,
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
                name="authorizedPersons[2].address.zipCode"
                value={formData.authorizedPersons[2].address.zipCode}
                onChange={(e) =>
                  handleAuthorizedPersonAddressChange(
                    2,
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
              name="authorizedPersons[2].phone"
              value={formData.authorizedPersons[2].phone}
              onChange={(e) =>
                handleAuthorizedPersonChange(2, "phone", e.target.value)
              }
            />

            <label>Alternate Phone:</label>
            <input
              type="text"
              name="authorizedPersons[2].alternatePhone"
              value={formData.authorizedPersons[2].alternatePhone}
              onChange={(e) =>
                handleAuthorizedPersonChange(
                  2,
                  "alternatePhone",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex input_spacer_med">
            <label>Relationship to Child/Parent</label>
            <input
              type="text"
              name="authorizedPersons[2].relationshipToChild"
              value={formData.authorizedPersons[2].relationshipToChild}
              onChange={(e) =>
                handleAuthorizedPersonChange(
                  2,
                  "relationshipToChild",
                  e.target.value
                )
              }
            />
          </div>

          <div className="emergency_contact">
            <h5 className="underline">
              In the case of an emergency who other than the parent may we
              contact:
            </h5>
            <div className="flex input_spacer_med">
              <label>Name:</label>
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={(e) =>
                  handleNestedChange("emergencyContact", "name", e.target.value)
                }
              />
            </div>
            <div className="addressbar">
              <label>Address:</label>
              <div>
                <input
                  type="text"
                  name="emergencyContact.address.street"
                  value={formData.emergencyContact.address.street}
                  onChange={(e) =>
                    handleAddressChange(
                      "emergencyContact",
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
                  name="emergencyContact.address.city"
                  value={formData.emergencyContact.address.city}
                  onChange={(e) =>
                    handleAddressChange(
                      "emergencyContact",
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
                  name="emergencyContact.address.state"
                  value={formData.emergencyContact.address.state}
                  onChange={(e) =>
                    handleAddressChange(
                      "emergencyContact",
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
                  name="emergencyContact.address.zipCode"
                  value={formData.emergencyContact.address.zipCode}
                  onChange={(e) =>
                    handleAddressChange(
                      "emergencyContact",
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
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={(e) =>
                  handleNestedChange(
                    "emergencyContact",
                    "phone",
                    e.target.value
                  )
                }
              />

              <label>Alternate Phone:</label>
              <input
                type="text"
                name="emergencyContact.alternatePhone"
                value={formData.emergencyContact.alternatePhone}
                onChange={(e) =>
                  handleNestedChange(
                    "emergencyContact",
                    "alternatePhone",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="flex input_spacer_med">
              <label>Relationship to Child/Parent</label>
              <input
                type="text"
                name="emergencyContact.relationshipToChild"
                value={formData.emergencyContact.relationshipToChild}
                onChange={(e) =>
                  handleNestedChange(
                    "emergencyContact",
                    "relationshipToChild",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="school_info">
            <h5 className="underline">
              My Child Attends the Following School (if Applicable)
            </h5>
            <div className="flex input_spacer_med">
              <label>Name of School</label>
              <input
                type="text"
                name="schoolInfo.name"
                value={formData.schoolInfo.name}
                onChange={(e) =>
                  handleNestedChange("schoolInfo", "name", e.target.value)
                }
              />
            </div>
            <div className="flex input_spacer_med">
              <label>Address:</label>
              <input
                type="text"
                name="schoolInfo.address"
                value={formData.schoolInfo.address}
                onChange={(e) =>
                  handleNestedChange("schoolInfo", "address", e.target.value)
                }
              />
            </div>
            <div className="flex input_spacer_med">
              <label>Phone:</label>
              <input
                type="text"
                name="schoolInfo.phone"
                value={formData.schoolInfo.phone}
                onChange={(e) =>
                  handleNestedChange("schoolInfo", "phone", e.target.value)
                }
              />

              <label>Teacher's Name:</label>
              <input
                type="text"
                name="schoolInfo.teacherName"
                value={formData.schoolInfo.teacherName}
                onChange={(e) =>
                  handleNestedChange(
                    "schoolInfo",
                    "teacherName",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
          <div className="parent_agreement">
            <h5>Parental Agreement</h5>
            <div>
              <h5>Medicine Administration </h5>
              <p>
                Before any medication is dispensed, I understand that I must
                provide a written authorization which includes the date to be
                administered, my child's name, name of medication, prescription
                number, dosage and the time to be administered. All medicine
                will be in its original package. I further understand that the
                center does not administer inhalers unless the child's doctor
                has a specified the amount to be inhaled and the time of the day
                to be administered.
              </p>
            </div>
            <div>
              <h5>Release from Center</h5>
              <p>
                I agree that my child will not be allowed to enter or leave the
                Center without being escorted by the parent(s); person(s);
                authorized by parent(s) or center personnel. Any person other
                than the parent or center staff must be stipulated in the
                child's application.
              </p>
            </div>
            <div>
              <h5>Notification of Address and Important Information</h5>
              <p>
                I acknowledge that it is my responsibility to keep my child's
                records current to reflect any significant changes at they may
                occur, telephone numbers, work location, emergency contacts,
                child's physician, health status, feeding plans, immunization
                records, etc.
              </p>
            </div>
            <div>
              <h5>Incidents</h5>
              <p>
                I understand that it is Gem's policy to keep me informed of any
                incidents, including illness, injuries, adverse reactions to
                medicines, and exposure to communicable diseases to which my
                child may be exposed. If the Center informs me that my child is
                ill, I understand that I must pick my child up within 40 minutes
                of being called.
              </p>
            </div>
            <div>
              <h5>Transportation</h5>
              <p>
                Gems will also obtain written authorization from me before my
                child participates in routine transportation, field trips, or
                special activities away from the Center including water related
                activities that are more than two feet deep.
              </p>
            </div>
            <div>
              <h5>Late pick up Policy</h5>
              <p>
                There is a $5.00 per minute per family late fee assessed for
                every minute the parent/guardian is late picking up his or her
                child. Hours of operation is 6:00am-6:30pm. The time assessed is
                according to Gem's Learning Academy's time clock.
              </p>
            </div>
            <div>
              <h5>Tuition and Fees</h5>
              <p>
                Tuition and fees are due on Monday of each week. If tuition is
                not paid by Monday evening at 6:30 pm, there will be a late fee
                of $20.00 charged and If payment is not made by Tuesday
                afternoon, then child/ren will not be able to attend on
                Wednesday. I agree to pay full tuition to reserve my child's
                slot if he or she is absent for an entire week.
              </p>
            </div>
            <div>
              <h5>Return Check Policy</h5>
              <p>
                Bounced checks incur a $25.00 return check fee and your child
                will not be able to attend the center until payment is paid in
                full. Method of payment should be with a money order or pay with
                a credit card online.
              </p>
            </div>
            <div>
              <h5>School Closing Policy</h5>
              <p>
                Gem's will be closed on the following days: New Year's Day,
                Martin Luther King Day, Memorial Day, Independence Day, Labor
                Day, Juneteenth, Thanksgiving Day and the day after, Christmas
                Eve, Christmas Day, New Year's Eve (Closes at 2:00 pm). Gems
                will close for inclement weather in accordance with Fulton
                County Schools.
              </p>
            </div>
            <div>
              <h5>Parent Handbook:</h5>
              <p>
                I have received and read the Parent Handbook for Gems Learning
                Academy. I understand the policies and procedures.
              </p>
            </div>
            <div>
              {/* <label>Signature of Parent/Guardian</label>
            <input
              type="text"
              className="parent_agreement_signature"\
              name="parentAgreementSignature"
              value={formData.parentAgreementSignature}
              onChange={handleChange}
            /> */}
              <SignaturePad
                label={"Signature of Parent/Guardian"}
                onSignatureChange={handleParentAgreementSignature}
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                className="parent_agreement_date"
                name="parentAgreementDate"
                value={formData.parentAgreementDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="emergency_medical_authroization">
            <h5>Emergency Medical Authorization</h5>
            <p>
              Should
              <input
                type="text"
                name="emergencyMedicalChildName"
                value={formData.emergencyMedicalChildName}
                onChange={handleChange}
              />
              , who was born on{" "}
              <input
                type="date"
                name="emergencyMedicalDOB"
                value={formData.emergencyMedicalDOB}
                onChange={handleChange}
              />
              , suffer an injury or illness while in the care of GEMS Learning
              Academy and the facility is unable to contact me immediately, it
              shall be authorized to secure such medical attention and care for
              the child as may be necessary. I (we) agree to keep the facility
              informed of changes in telephone numbers, etc., where I (we) can
              be reached.
            </p>

            <p>
              The facility agrees to keep me informed of any incidents requiring
              professional medical attention involving my child.
            </p>

            <div className="flex input_spacer_med">
              <label>Child's Primary source of health care is:</label>
              <input
                type="text"
                name="primaryHealthCare"
                value={formData.primaryHealthCare}
                onChange={handleChange}
              />
            </div>

            <div className="flex space_btw">
              <div className="phy_and_tel_container flex column">
                <input
                  type="text"
                  name="physicianName"
                  value={formData.physicianName}
                  onChange={handleChange}
                />
                <label>Physician's Name</label>
              </div>
              <div className="phy_and_tel_container flex column">
                <input
                  type="text"
                  name="physicianPhone"
                  value={formData.physicianPhone}
                  onChange={handleChange}
                />
                <label>Telephone Number</label>
              </div>
            </div>

            <div>
              <label>
                Known Medical Conditions (diabetic, asthmatic, drug allergies)
              </label>

              <div className="double_row_input">
                <div>
                  <input
                    type="text"
                    name="medicalConditions[0]"
                    value={formData.medicalConditions[0]}
                    onChange={(e) =>
                      handleMedicalConditionChange(0, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    name="medicalConditions[1]"
                    value={formData.medicalConditions[1]}
                    onChange={(e) =>
                      handleMedicalConditionChange(1, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    name="medicalConditions[2]"
                    value={formData.medicalConditions[2]}
                    onChange={(e) =>
                      handleMedicalConditionChange(2, e.target.value)
                    }
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="medicalConditions[3]"
                    value={formData.medicalConditions[3]}
                    onChange={(e) =>
                      handleMedicalConditionChange(3, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    name="medicalConditions[4]"
                    value={formData.medicalConditions[4]}
                    onChange={(e) =>
                      handleMedicalConditionChange(4, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    name="medicalConditions[5]"
                    value={formData.medicalConditions[5]}
                    onChange={(e) =>
                      handleMedicalConditionChange(5, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="sign">
              <label>Signed:</label>
              <div className="flex column">
                <SignaturePad
                  label={"Parent/Legal Guardian"}
                  onSignatureChange={handleParentGuardianSignature}
                />
                {/* <input
                type="text"
                name="parentGuardianSignature"
                value={formData.parentGuardianSignature}
                onChange={handleChange}
              />
              <label>Parent/Legal Guardian</label> */}
              </div>
            </div>

            <div>
              <label>Date:</label>
              <input
                type="date"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleChange}
              />
            </div>

            <div className="phone-section">
              <label>Telephone Numbers:</label>
              <input
                type="text"
                name="phoneNumbers.home"
                value={formData.phoneNumbers.home}
                onChange={(e) =>
                  handleNestedChange("phoneNumbers", "home", e.target.value)
                }
              />
              <label>Home</label>

              <div className="spacer"></div>
              <input
                type="text"
                name="phoneNumbers.work"
                value={formData.phoneNumbers.work}
                onChange={(e) =>
                  handleNestedChange("phoneNumbers", "work", e.target.value)
                }
              />
              <label>Work</label>

              <div className="spacer"></div>
              <input
                type="text"
                name="phoneNumbers.cell"
                value={formData.phoneNumbers.cell}
                onChange={(e) =>
                  handleNestedChange("phoneNumbers", "cell", e.target.value)
                }
              />
              <label>Cell</label>
            </div>
          </div>
          <div className="doc_info">
            <h5>Child's Physician or Health Care Provider</h5>

            <div>
              <label>Name of Doctor:</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
              />
            </div>

            <div className="addressbar">
              <label>Address:</label>
              <div>
                <input
                  type="text"
                  name="doctorAddress.street"
                  value={formData.doctorAddress.street}
                  onChange={(e) =>
                    handleAddressChange(
                      "doctorAddress",
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
                  name="doctorAddress.city"
                  value={formData.doctorAddress.city}
                  onChange={(e) =>
                    handleAddressChange("doctorAddress", "city", e.target.value)
                  }
                />
                <label>City</label>
              </div>
              <div>
                <input
                  type="text"
                  name="doctorAddress.state"
                  value={formData.doctorAddress.state}
                  onChange={(e) =>
                    handleAddressChange(
                      "doctorAddress",
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
                  name="doctorAddress.zipCode"
                  value={formData.doctorAddress.zipCode}
                  onChange={(e) =>
                    handleAddressChange(
                      "doctorAddress",
                      "zipCode",
                      e.target.value
                    )
                  }
                />
                <label>Zip Code</label>
              </div>
            </div>

            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="doctorPhone"
                value={formData.doctorPhone}
                onChange={handleChange}
              />

              <label>Doctor's Name:</label>
              <input
                type="text"
                name="physicianName"
                value={formData.physicianName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>
                The following special accommodations may be required to meet my
                child's needs while at Gems' Learning Academy:
              </label>
              <input
                type="text"
                name="specialAccommodations"
                value={formData.specialAccommodations}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Describe any allergies your child may have.</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
              />
            </div>

            <div>
              <p>Does your child take any medication on a routine basis?</p>
              <label>
                <input
                  type="radio"
                  name="takesRoutineMedication"
                  value="yes"
                  checked={formData.takesRoutineMedication === "yes"}
                  onChange={handleChange}
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="takesRoutineMedication"
                  value="no"
                  checked={formData.takesRoutineMedication === "no"}
                  onChange={handleChange}
                />{" "}
                No
              </label>
            </div>

            <div>
              <label>If yes, please explain and list any medications.</label>
              <input
                type="text"
                name="medicationExplanation"
                value={formData.medicationExplanation}
                onChange={handleChange}
              />
            </div>

            <div>
              {/* <div>
              <label>If yes, please explain and list any medications.</label>
              <input
                type="text"
                name="medicationExplanation"
                value={formData.medicationExplanation}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>If yes, please explain and list any medications.</label>
              <input
                type="text"
                name="medicationExplanation"
                value={formData.medicationExplanation}
                onChange={handleChange}
              />
            </div> */}
            </div>

            <p>
              GEMS Learning Academy does not discriminate of the basis of race,
              sex, age, disability, health, religion, or national origin.
              Children with persistent health or other challenges will be
              required to provide a physician's statement that their condition
              is satisfactory for full participation in the program.
            </p>
          </div>
          <div className="transport_agreement">
            <h5>Transportation Agreement</h5>

            <div>
              <label>This is to certify that I give</label>
              <div className="underneath_label">
                <input value={"Gems Learning Academy"} type="text" readOnly />
                <label>Name of Facility</label>
              </div>
            </div>

            <div>
              <label>Permission to transport my child</label>
              <div className="underneath_label">
                <input
                  type="text"
                  name="transportChildName"
                  value={formData.transportChildName}
                  onChange={handleChange}
                />
                <label>Name of Child</label>
              </div>
            </div>

            <div>
              <label>From</label>
              <input
                type="text"
                name="transportFrom"
                value={formData.transportFrom}
                onChange={handleChange}
              />
              <label>at</label>
              <input
                type="text"
                name="transportFromTime"
                value={formData.transportFromTime}
                onChange={handleChange}
              />
              <label></label>

              <div>
                (
                <label>
                  <input
                    type="radio"
                    name="transportFromAMPM"
                    value="am"
                    checked={formData.transportFromAMPM === "am"}
                    onChange={handleChange}
                  />{" "}
                  AM
                </label>
                /
                <label>
                  <input
                    type="radio"
                    name="transportFromAMPM"
                    value="pm"
                    checked={formData.transportFromAMPM === "pm"}
                    onChange={handleChange}
                  />{" "}
                  PM
                </label>
                )
              </div>
            </div>

            <div>
              <label>To</label>
              <input
                type="text"
                name="transportTo"
                value={formData.transportTo}
                onChange={handleChange}
              />
              <label>at</label>
              <input
                type="text"
                name="transportToTime"
                value={formData.transportToTime}
                onChange={handleChange}
              />
              <label></label>

              <div>
                (
                <label>
                  <input
                    type="radio"
                    name="transportToAMPM"
                    value="am"
                    checked={formData.transportToAMPM === "am"}
                    onChange={handleChange}
                  />{" "}
                  AM
                </label>
                /
                <label>
                  <input
                    type="radio"
                    name="transportToAMPM"
                    value="pm"
                    checked={formData.transportToAMPM === "pm"}
                    onChange={handleChange}
                  />{" "}
                  PM
                </label>
                )
              </div>
            </div>

            <div>
              <label>My child will be transported from</label>
              <input
                type="text"
                name="transportChildFrom"
                value={formData.transportChildFrom}
                onChange={handleChange}
              />
              <label>at</label>
              <input
                type="text"
                name="transportChildFromTime"
                value={formData.transportChildFromTime}
                onChange={handleChange}
              />
              <label></label>

              <div>
                (
                <label>
                  <input
                    type="radio"
                    name="transportChildFromAMPM"
                    value="am"
                    checked={formData.transportChildFromAMPM === "am"}
                    onChange={handleChange}
                  />{" "}
                  AM
                </label>
                /
                <label>
                  <input
                    type="radio"
                    name="transportChildFromAMPM"
                    value="pm"
                    checked={formData.transportChildFromAMPM === "pm"}
                    onChange={handleChange}
                  />{" "}
                  PM
                </label>
                )
              </div>
            </div>

            <div>
              <label>To</label>
              <input type="text" value={"Gems Learning Academy"} readOnly />
              <label>at</label>
              <input
                type="text"
                name="transportChildToTime"
                value={formData.transportChildToTime}
                onChange={handleChange}
              />
              <label></label>

              <div>
                (
                <label>
                  <input
                    type="radio"
                    name="transportChildToAMPM"
                    value="am"
                    checked={formData.transportChildToAMPM === "am"}
                    onChange={handleChange}
                  />{" "}
                  AM
                </label>
                /
                <label>
                  <input
                    type="radio"
                    name="transportChildToAMPM"
                    value="pm"
                    checked={formData.transportChildToAMPM === "pm"}
                    onChange={handleChange}
                  />{" "}
                  PM
                </label>
                )
              </div>
            </div>

            <p>On the following days:</p>
            <div>
              <p>Select Days:</p>
              <label>
                <input
                  type="checkbox"
                  name="transportDays.monday"
                  checked={formData.transportDays.monday}
                  onChange={handleChange}
                />{" "}
                Monday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transportDays.tuesday"
                  checked={formData.transportDays.tuesday}
                  onChange={handleChange}
                />{" "}
                Tuesday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transportDays.wednesday"
                  checked={formData.transportDays.wednesday}
                  onChange={handleChange}
                />{" "}
                Wednesday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transportDays.thursday"
                  checked={formData.transportDays.thursday}
                  onChange={handleChange}
                />{" "}
                Thursday
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transportDays.friday"
                  checked={formData.transportDays.friday}
                  onChange={handleChange}
                />{" "}
                Friday
              </label>
            </div>

            <div>
              <input
                type="text"
                name="authorizedReceiver"
                value={formData.authorizedReceiver}
                onChange={handleChange}
              />
              <label>
                is authorized to receive my child. In the event the authorized
              </label>
            </div>

            <div>
              <label>
                Person is not present to receive my child, the following
                procedures are to be followed:
              </label>

              <input
                type="text"
                name="alternatePickupProcedures"
                value={formData.alternatePickupProcedures}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>The</label>
              <input type="text" value={"Gems Learning Academy"} readOnly />
              <label>is approximately</label>
              <input
                type="text"
                name="distanceInMiles"
                value={formData.distanceInMiles}
                onChange={handleChange}
              />
              <label>
                miles from the center. In the event my child is not to be
                transported as outlined above, I agree to notify Gem's Learning
                Academy.
              </label>
            </div>

            <div className="flex align_center">
              <div>
                <SignaturePad
                  label={"Signature (Parent/Guardian)"}
                  onSignatureChange={handleTransportParentSignature}
                />
                {/* <label>Signature (Parent/Guardian)</label>
              <input
                type="text"
                name="transportParentSignature"
                value={formData.transportParentSignature}
                onChange={handleChange}
              /> */}
              </div>
              <div>
                <label>Date</label>
                <input
                  type="date"
                  name="transportSignatureDate"
                  value={formData.transportSignatureDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="vehicle_emergency">
            <h5>Vehicle Emergency Medical Information</h5>

            <div>
              <label>Child's Name:</label>
              <input
                type="text"
                name="vehicleChildName"
                value={formData.vehicleChildName}
                onChange={handleChange}
              />
              <label>Date of Birth:</label>
              <input
                type="date"
                name="vehicleChildDOB"
                value={formData.vehicleChildDOB}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Address:</label>
              <input
                type="text"
                name="vehicleAddress"
                value={formData.vehicleAddress}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>City:</label>
              <input
                type="text"
                name="vehicleCity"
                value={formData.vehicleCity}
                onChange={handleChange}
              />

              <label>State:</label>
              <input
                type="text"
                name="vehicleState"
                value={formData.vehicleState}
                onChange={handleChange}
              />

              <label>Zip Code:</label>
              <input
                type="text"
                name="vehicleZip"
                value={formData.vehicleZip}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Home Phone:</label>
              <input
                type="text"
                name="vehicleHomePhone"
                value={formData.vehicleHomePhone}
                onChange={handleChange}
              />

              <label>Work Phone:</label>
              <input
                type="text"
                name="vehicleWorkPhone"
                value={formData.vehicleWorkPhone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Cell Phone:</label>
              <input
                type="text"
                name="vehicleCellPhone"
                value={formData.vehicleCellPhone}
                onChange={handleChange}
              />

              <label>Email Address:</label>
              <input
                type="text"
                name="vehicleEmail"
                value={formData.vehicleEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Mother's Name:</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
              />

              <label>Work Phone</label>
              <input
                type="text"
                name="motherWorkPhone"
                value={formData.motherWorkPhone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Cell Phone:</label>
              <input
                type="text"
                name="motherCellPhone"
                value={formData.motherCellPhone}
                onChange={handleChange}
              />

              <label>Email Address:</label>
              <input
                type="text"
                name="motherEmail"
                value={formData.motherEmail}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Father's Name:</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
              />

              <label>Work Phone:</label>
              <input
                type="text"
                name="fatherWorkPhone"
                value={formData.fatherWorkPhone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Cell Phone:</label>
              <input
                type="text"
                name="fatherCellPhone"
                value={formData.fatherCellPhone}
                onChange={handleChange}
              />

              <label>Email Address:</label>
              <input
                type="text"
                name="fatherEmail"
                value={formData.fatherEmail}
                onChange={handleChange}
              />
            </div>
          </div>
          <div></div>
          <div className="emergency_non_parents">
            <h5>
              PERSON TO NOTIFY IN AN EMERGENCY IF PARENTS CANNOT BE REACHED:
            </h5>

            <div className="flex">
              <label>Name:</label>
              <input
                type="text"
                name="emergencyNonParentName"
                value={formData.emergencyNonParentName}
                onChange={handleChange}
              />

              <label>Phone Number:</label>
              <input
                type="text"
                name="emergencyNonParentPhone"
                value={formData.emergencyNonParentPhone}
                onChange={handleChange}
              />
            </div>

            <div className="flex">
              <label>Child's Doctor:</label>
              <input
                type="text"
                name="childDoctor"
                value={formData.childDoctor}
                onChange={handleChange}
              />

              <label>Phone Number:</label>
              <input
                type="text"
                name="childDoctorPhone"
                value={formData.childDoctorPhone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Medical Facility used by Gem's Learning Academy:</label>
              <h5>
                Southern Regional Medical Center, 11 Upper Riverdale Rd.
                Riverdale, Ga. 30274
              </h5>

              <div className="flex">
                <label>Child's Allergies:</label>
                <input
                  type="text"
                  name="childAllergies"
                  value={formData.childAllergies}
                  onChange={handleChange}
                />
              </div>
              <div className="flex">
                <label>Current Prescribed Medication:</label>
                <input
                  type="text"
                  name="currentPrescribedMedication"
                  value={formData.currentPrescribedMedication}
                  onChange={handleChange}
                />
              </div>
              <div className="flex">
                <label>Child's Special needs and conditions:</label>
                <input
                  type="text"
                  name="childSpecialNeeds"
                  value={formData.childSpecialNeeds}
                  onChange={handleChange}
                />
              </div>

              <p>
                In the event of an emergency and the center cannot get in touch
                with me, I hereby authorize any needed emergency medical care. I
                further agree to be fully responsible for all medical expenses
                incurred during the treatment of my child.
              </p>

              <div className="flex">
                <label>Child's Name:</label>
                <input
                  type="text"
                  name="emergencyChildName"
                  value={formData.emergencyChildName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex">
                <SignaturePad
                  label={"Signature (Parent/Guardian):"}
                  onSignatureChange={handleEmergencyParentSignature}
                />
                {/* <label>Signature (Parent/Guardian):</label>
              <input
                type="text"
                name="emergencyParentSignature"
                value={formData.emergencyParentSignature}
                onChange={handleChange}
              /> */}
              </div>
              <div className="flex">
                <label>Witness By:</label>
                <input
                  type="text"
                  name="emergencyWitness"
                  value={formData.emergencyWitness}
                  onChange={handleChange}
                />
                <label>Date</label>
                <input
                  type="date"
                  name="emergencyWitnessDate"
                  value={formData.emergencyWitnessDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="allergy_statement">
            <h5>Allergy Statement</h5>

            <div className="flex">
              <label>Child's Name:</label>
              <input
                type="text"
                name="allergyChildName"
                value={formData.allergyChildName}
                onChange={handleChange}
              />
            </div>

            <div className="flex">
              <label>Parent's Name:</label>
              <input
                type="text"
                name="allergyParentName"
                value={formData.allergyParentName}
                onChange={handleChange}
              />
            </div>

            <div className="flex">
              <label>Nature of Allergy:</label>
              <input
                type="text"
                name="natureOfAllergy"
                value={formData.natureOfAllergy}
                onChange={handleChange}
              />
            </div>

            <div className="allergan_n_subs">
              <div>
                <label>Foods Child is Allergic to:</label>
                {formData.allergicFoods.map((food, index) => (
                  <input
                    key={`allergic-food-${index}`}
                    type="text"
                    value={food}
                    onChange={(e) =>
                      handleFoodArrayChange(
                        "allergicFoods",
                        index,
                        e.target.value
                      )
                    }
                  />
                ))}
              </div>

              <div>
                <label>Substitute Foods:</label>
                {formData.substituteFoods.map((food, index) => (
                  <input
                    key={`substitute-food-${index}`}
                    type="text"
                    value={food}
                    onChange={(e) =>
                      handleFoodArrayChange(
                        "substituteFoods",
                        index,
                        e.target.value
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex">
              <label>Health Care Practitioner:</label>
              <div className="flex column full_width">
                <input
                  type="text"
                  name="healthcarePractitionerName"
                  value={formData.healthcarePractitionerName}
                  onChange={handleChange}
                />
                <label>(Print Name)</label>
              </div>
              <div className="flex column full_width">
                <input
                  type="text"
                  name="healthcarePractitionerTitle"
                  value={formData.healthcarePractitionerTitle}
                  onChange={handleChange}
                />
                <label>(Title)</label>
              </div>
            </div>

            <div className="flex column" style={{ marginBlock: "2rem" }}>
              {/* <input
              type="text"
              className="short_input"
              name="healthcareProviderSignature"
              value={formData.healthcareProviderSignature}
              onChange={handleChange}
            /> 
            <label>Signature of Healthcare Provider</label> */}
              <SignaturePad
                label={"Signature of Healthcare Provider"}
                onSignatureChange={handleHealthcareProviderSignature}
              />
            </div>

            <div className="flex column" style={{ marginBlock: "2rem" }}>
              <input
                type="date"
                className="short_input"
                name="healthcareProviderDate"
                value={formData.healthcareProviderDate}
                onChange={handleChange}
              />
              <label>Date</label>
            </div>
          </div>
          <button
            className="submit"
            disabled={submitSuccess}
            onClick={handleSubmit}
            type="button"
          >
            {submitSuccess ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
}
