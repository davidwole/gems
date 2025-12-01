import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
//  import "../../styles/I9Form.module.css";
import "../../styles/I9Form.css";
import Signature from "../../components/Signature";
import { AuthContext } from "../../context/AuthContext";
import { submitJobApplication } from "../../services/api";

export default function I9Form() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Initialize all form fields in a single state object
  const [formData, setFormData] = useState({
    user: "",
    branch: "",
    // Applicant Information
    firstName: "",
    lastName: "",
    middleName: "",
    date: "",

    // Address Information
    streetAddress: "",
    apartmentUnit: "",
    city: "",
    state: "",
    zipCode: "",

    // Permanent/Secondary Address
    streetAddressTwo: "",
    apartmentUnitTwo: "",
    cityTwo: "",
    stateTwo: "",
    zipCodeTwo: "",

    // Contact Information
    phone: "",
    email: "",

    // Job Details
    dateAvailable: "",
    desiredSalary: "",
    position: "",

    // Citizenship & Work Status
    isUsCitizen: false,
    isAuthorizedToWork: false,

    // Previous Employment with Company
    hasWorkedForCompany: false,
    previousEmploymentDate: "",

    // Hours Sought
    hoursPreference: "", // 'fullTime', 'partTime', or 'anyHours'

    // Current Employment
    isCurrentlyEmployed: false,
    canContactCurrentEmployer: false,

    // Criminal History
    hasBeenConvictedOfFelony: false,
    felonyExplanation: "",

    // Education - High School (repeated sections combined into arrays)
    education: [
      {
        schoolName: "",
        address: "",
        fromDate: "",
        toDate: "",
        graduated: false,
        degree: "",
      },
      {
        schoolName: "",
        address: "",
        fromDate: "",
        toDate: "",
        graduated: false,
        degree: "",
      },
      {
        schoolName: "",
        address: "",
        fromDate: "",
        toDate: "",
        graduated: false,
        degree: "",
      },
    ],

    // Criminal History Details
    canContactPreviousEmployers: false,
    hasCriminalRecord: false,
    criminalRecordExplanation: "",
    hasAbusedOrNeglected: false,
    abuseExplanation: "",
    canPerformDuties: false,
    inabilityExplanation: "",
    willSubmitToBackgroundCheck: false,
    willSubmitToFingerprintCheck: false,
    hasValidDriversLicense: false,
    hasCprTraining: false,
    hasBeenDisciplined: false,
    disciplinaryExplanation: ["", "", ""],

    // Employment History (repeated sections combined into arrays)
    previousEmployment: [
      {
        company: "",
        phone: "",
        address: "",
        supervisor: "",
        jobTitle: "",
        startingSalary: "",
        endingSalary: "",
        responsibilities: "",
        fromDate: "",
        toDate: "",
        reasonForLeaving: "",
        canContact: false,
      },
      {
        company: "",
        phone: "",
        address: "",
        supervisor: "",
        jobTitle: "",
        startingSalary: "",
        endingSalary: "",
        responsibilities: "",
        fromDate: "",
        toDate: "",
        reasonForLeaving: "",
        canContact: false,
      },
      {
        company: "",
        phone: "",
        address: "",
        supervisor: "",
        jobTitle: "",
        startingSalary: "",
        endingSalary: "",
        responsibilities: "",
        fromDate: "",
        toDate: "",
        reasonForLeaving: "",
        canContact: false,
      },
    ],

    // Questionnaire
    questionnaire: {
      importantToolForChildren: ["", "", ""],
      feelingsAboutYelling: ["", "", ""],
      handlingConflicts: ["", "", ""],
      negativeAttitude: ["", "", ""],
      reasonToWorkInChildcare: ["", "", ""],
      greetingParentsAndChildren: ["", "", ""],
      praisingChildren: ["", "", ""],
      disciplineMessage: ["", "", ""],
      tellingChildIsBad: ["", "", ""],
      enjoymentFromWorkingWithChildren: ["", "", ""],
      hasHeldChildcareLicense: false,
      enjoymentFromWorkingWithChildrenTwo: ["", "", ""], // Appears to be a duplicate in the form
    },

    // References
    references: [
      {
        fullName: "",
        relationship: "",
        company: "",
        phone: "",
        address: "",
      },
      {
        fullName: "",
        relationship: "",
        company: "",
        phone: "",
        address: "",
      },
      {
        fullName: "",
        relationship: "",
        company: "",
        phone: "",
        address: "",
      },
    ],

    // Military Service
    militaryService: {
      branch: "",
      fromDate: "",
      toDate: "",
      rankAtDischarge: "",
      dischargeType: "",
      dischargeExplanation: "",
    },

    // Signature
    signature: "",
    signatureDate: "",
  });

  // Universal handler function for all form inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle special cases with nested objects/arrays
    if (name.includes(".")) {
      // Handle array properties (like disciplinaryExplanation.0)
      if (name.startsWith("disciplinaryExplanation.")) {
        const index = parseInt(name.split(".")[1]);
        setFormData((prevState) => {
          const updatedArray = [...prevState.disciplinaryExplanation];
          updatedArray[index] = value; // Just store the string value directly
          return {
            ...prevState,
            disciplinaryExplanation: updatedArray,
          };
        });
      } else {
        // Handle nested properties (like education.0.schoolName)
        const [parentKey, childKey] = name.split(".");
        if (!isNaN(childKey)) {
          // Handle array items (like education.0)
          const index = parseInt(childKey);
          const nestedField = name.split(".")[2];
          setFormData((prevState) => {
            const updatedArray = [...prevState[parentKey]];
            updatedArray[index] = {
              ...updatedArray[index],
              [nestedField]: type === "checkbox" ? checked : value,
            };
            return {
              ...prevState,
              [parentKey]: updatedArray,
            };
          });
        } else if (childKey && name.includes(".", name.indexOf(".") + 1)) {
          // Handle deeper nesting (like questionnaire.importantToolForChildren.0)
          const nestedField = name.split(".")[1];
          const index = parseInt(name.split(".")[2]);
          setFormData((prevState) => {
            const updatedQuestionnaire = { ...prevState[parentKey] };
            const updatedArray = [...updatedQuestionnaire[nestedField]];
            updatedArray[index] = value;
            updatedQuestionnaire[nestedField] = updatedArray;
            return {
              ...prevState,
              [parentKey]: updatedQuestionnaire,
            };
          });
        } else {
          // Handle simple nested objects (like militaryService.branch)
          const field = name.split(".")[1];
          setFormData((prevState) => ({
            ...prevState,
            [parentKey]: {
              ...prevState[parentKey],
              [field]: type === "checkbox" ? checked : value,
            },
          }));
        }
      }
    } else {
      // Handle regular inputs
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSignatureSave = (dataUrl) => {
    setFormData((prevState) => ({
      ...prevState,
      signature: dataUrl,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await submitJobApplication(formData, token);

      if (response.success) {
        alert("Application logged successfully");
        setTimeout(() => {
          navigate("/");
        }, 300);
        console.log(success);
      }

      if (!response.ok) {
        console.log(response);
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="job_container">
      <div className="job_form">
        <div className="header_container">
          <h1 className="job_form_header">
            Gems Learning Academy Union City GA
          </h1>
        </div>
        <h3>Employee Application</h3>

        <div className="section_header">
          <h4>Applicant Information</h4>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Applicant Information */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label>Full Name: </label>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                <label>Last</label>
              </div>
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <label>First</label>
              </div>
              <div>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
                <label>M.I</label>
              </div>
            </div>
            <div className="flex align_center">
              <label className="special_label">Date: </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Present Address */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label>Present Address: </label>
              <div>
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                />
                <label>Street Address</label>
              </div>
              <div>
                <input
                  type="text"
                  name="apartmentUnit"
                  value={formData.apartmentUnit}
                  onChange={handleInputChange}
                />
                <label>Apartment/Unit#</label>
              </div>
            </div>
          </div>

          {/* City/State/Zip for Present Address */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label>Permanent Address: </label>
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <label>City</label>
              </div>
              <div>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                <label>State</label>
              </div>
              <div>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
                <label>ZIP code</label>
              </div>
            </div>
          </div>

          {/* Secondary Address */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label> Address: </label>
              <div>
                <input
                  type="text"
                  name="streetAddressTwo"
                  value={formData.streetAddressTwo}
                  onChange={handleInputChange}
                />
                <label>Street Address</label>
              </div>
              <div>
                <input
                  type="text"
                  name="apartmentUnitTwo"
                  value={formData.apartmentUnitTwo}
                  onChange={handleInputChange}
                />
                <label>Apartment/Unit#</label>
              </div>
            </div>
          </div>

          {/* City/State/Zip for Secondary Address */}
          <div className="flex align_center">
            <div className="flex align_center">
              <div>
                <input
                  type="text"
                  name="cityTwo"
                  value={formData.cityTwo}
                  onChange={handleInputChange}
                />
                <label>City</label>
              </div>
              <div>
                <input
                  type="text"
                  name="stateTwo"
                  value={formData.stateTwo}
                  onChange={handleInputChange}
                />
                <label>State</label>
              </div>
              <div>
                <input
                  type="text"
                  name="zipCodeTwo"
                  value={formData.zipCodeTwo}
                  onChange={handleInputChange}
                />
                <label>ZIP Code</label>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex align_center">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />

            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {/* Job Details */}
          <div className="flex align_center">
            <label>Date Available:</label>
            <input
              type="date"
              name="dateAvailable"
              value={formData.dateAvailable}
              onChange={handleInputChange}
            />

            <label>Desired Salary:</label>
            <input
              type="text"
              placeholder="$"
              name="desiredSalary"
              value={formData.desiredSalary}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex align_center">
            <label>Position Applied for:</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
            />
          </div>

          {/* US Citizenship */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label>Are you a citizen of the United States:</label>
              <div>
                <label>YES</label>
                <input
                  type="checkbox"
                  name="isUsCitizen"
                  checked={formData.isUsCitizen}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>NO</label>
                <input
                  type="checkbox"
                  checked={!formData.isUsCitizen}
                  onChange={() =>
                    setFormData({ ...formData, isUsCitizen: false })
                  }
                />
              </div>
              <label>If no, are authorized of to work in the U.S.?</label>
              <div>
                <label>YES</label>
                <input
                  disabled={formData.isUsCitizen}
                  type="checkbox"
                  name="isAuthorizedToWork"
                  checked={formData.isAuthorizedToWork}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>NO</label>
                <input
                  disabled={formData.isUsCitizen}
                  type="checkbox"
                  checked={!formData.isAuthorizedToWork}
                  onChange={() =>
                    setFormData({ ...formData, isAuthorizedToWork: false })
                  }
                />
              </div>
            </div>
          </div>

          {/* Previous work with company */}
          <div className="flex align_center">
            <label>Have you ever worked for this company?:</label>
            <div>
              <label>YES</label>
              <input
                type="checkbox"
                name="hasWorkedForCompany"
                checked={formData.hasWorkedForCompany}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>NO</label>
              <input
                type="checkbox"
                checked={!formData.hasWorkedForCompany}
                onChange={() =>
                  setFormData({ ...formData, hasWorkedForCompany: false })
                }
              />
            </div>
            <label>If yes, when?</label>
            <input
              type="text"
              name="previousEmploymentDate"
              value={formData.previousEmploymentDate}
              onChange={handleInputChange}
              disabled={!formData.hasWorkedForCompany}
            />
          </div>

          {/* Hours sought */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label>Hours sought:</label>
              <div className="flex align_center">
                <label>Full Time</label>
                <input
                  type="checkbox"
                  checked={formData.hoursPreference === "fullTime"}
                  onChange={() =>
                    setFormData({ ...formData, hoursPreference: "fullTime" })
                  }
                />
              </div>
              <div className="flex">
                <label>Part Time</label>
                <input
                  type="checkbox"
                  checked={formData.hoursPreference === "partTime"}
                  onChange={() =>
                    setFormData({ ...formData, hoursPreference: "partTime" })
                  }
                />
              </div>
              <div className="flex">
                <label>Any Hours</label>
                <input
                  type="checkbox"
                  checked={formData.hoursPreference === "anyHours"}
                  onChange={() =>
                    setFormData({ ...formData, hoursPreference: "anyHours" })
                  }
                />
              </div>
            </div>
          </div>

          {/* Current employment */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label>Are you employed?</label>
              <div>
                <label>YES</label>
                <input
                  type="checkbox"
                  name="isCurrentlyEmployed"
                  checked={formData.isCurrentlyEmployed}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>NO</label>
                <input
                  type="checkbox"
                  checked={!formData.isCurrentlyEmployed}
                  onChange={() =>
                    setFormData({ ...formData, isCurrentlyEmployed: false })
                  }
                />
              </div>
              <label>If so, may we contact your present employer?</label>
              <div>
                <label>YES</label>
                <input
                  type="checkbox"
                  name="canContactCurrentEmployer"
                  checked={formData.canContactCurrentEmployer}
                  onChange={handleInputChange}
                  disabled={!formData.isCurrentlyEmployed}
                />
              </div>
              <div>
                <label>NO</label>
                <input
                  type="checkbox"
                  checked={!formData.canContactCurrentEmployer}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      canContactCurrentEmployer: false,
                    })
                  }
                  disabled={!formData.isCurrentlyEmployed}
                />
              </div>
            </div>
          </div>

          {/* Felony conviction */}
          <div className="flex align_center">
            <div className="flex align_center">
              <label>Have you ever been convicted of a felony?</label>
              <div>
                <label>YES</label>
                <input
                  type="checkbox"
                  name="hasBeenConvictedOfFelony"
                  checked={formData.hasBeenConvictedOfFelony}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>NO</label>
                <input
                  type="checkbox"
                  checked={!formData.hasBeenConvictedOfFelony}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      hasBeenConvictedOfFelony: false,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <textarea
            placeholder="If yes explain:"
            name="felonyExplanation"
            value={formData.felonyExplanation}
            onChange={handleInputChange}
            disabled={!formData.hasBeenConvictedOfFelony}
          ></textarea>

          {/* Education Section - This would continue with more fields */}
          <div className="section_header">
            <h4>Education</h4>
          </div>

          {/* Education entries rendered in a loop */}
          {formData.education.map((edu, index) => (
            <div key={`education-${index}`}>
              <div className="flex align_center">
                <label>High School:</label>
                <input
                  type="text"
                  name={`education.${index}.schoolName`}
                  value={edu.schoolName}
                  onChange={handleInputChange}
                />
                <label>Address:</label>
                <input
                  type="text"
                  name={`education.${index}.address`}
                  value={edu.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex align_center">
                <label>From:</label>
                <input
                  type="text"
                  name={`education.${index}.fromDate`}
                  value={edu.fromDate}
                  onChange={handleInputChange}
                />
                <label>To:</label>
                <input
                  type="text"
                  name={`education.${index}.toDate`}
                  value={edu.toDate}
                  onChange={handleInputChange}
                />
                <label>Did you graduate?</label>
                <div>
                  <label>YES</label>
                  <input
                    type="checkbox"
                    name={`education.${index}.graduated`}
                    checked={edu.graduated}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>NO</label>
                  <input
                    type="checkbox"
                    checked={!edu.graduated}
                    onChange={() => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index] = {
                        ...updatedEducation[index],
                        graduated: false,
                      };
                      setFormData({ ...formData, education: updatedEducation });
                    }}
                  />
                </div>
                <label>Degree:</label>
                <input
                  type="text"
                  name={`education.${index}.degree`}
                  value={edu.degree}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ))}

          {/* The rest of the form would continue here... */}

          <div className="section_header">
            <h4>Criminal History</h4>
          </div>

          <div>
            <table>
              <tbody>
                <tr>
                  <td>May we contact previous employers?</td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="canContactPreviousEmployers"
                        checked={formData.canContactPreviousEmployers}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="canContactPreviousEmployers"
                        checked={!formData.canContactPreviousEmployers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            canContactPreviousEmployers: !e.target.checked,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Do you have a criminal record?</td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="hasCriminalRecord"
                        checked={formData.hasCriminalRecord}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="hasCriminalRecord"
                        checked={!formData.hasCriminalRecord}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hasCriminalRecord: !e.target.checked,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <table>
              <tbody>
                <tr>
                  <td colSpan="2">If so explain:</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <input
                      type="text"
                      name="criminalRecordExplanation"
                      value={formData.criminalRecordExplanation}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Have you ever been shown by credible evidence e.g, a court
                    order or jury, a department investigation or other reliable
                    evidence to have abused, neglected or deprived a child or
                    adult or to have subjected any person to serious injury
                    because of intentional or grossly negligent misconduct?
                  </td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="hasAbusedOrNeglected"
                        checked={formData.hasAbusedOrNeglected}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="hasAbusedOrNeglected"
                        checked={!formData.hasAbusedOrNeglected}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hasAbusedOrNeglected: !e.target.checked,
                          })
                        }
                      />

                      <div>
                        <label>If yes, explain: </label>
                        <input
                          type="text"
                          name="abuseExplanation"
                          value={formData.abuseExplanation}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    Under the American with Disabilities Act of 1991, this
                    program is required to reasonably accommodate individuals
                    with a disability. The reasonable accommodation requirement
                    applies to the application process, any pre-employment
                    testing, interviews, and actual employment, but only if the
                    program supervisor is made aware that an accommodation is
                    required. If you are disabled and require accommodation, you
                    may request it at any time during the interview process. You
                    are obligated to inform the program director of your needs
                    if it will impact your ability to preform the job for which
                    you are applying.
                  </td>
                </tr>
                <tr>
                  <td>
                    Having read the job description for the position for which
                    you are applying, are you in all respects, able to
                    adequately preform the duties as described?
                  </td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="canPerformDuties"
                        checked={formData.canPerformDuties}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="canPerformDuties"
                        checked={!formData.canPerformDuties}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            canPerformDuties: !e.target.checked,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <label>If no explain:</label>
                    <input
                      type="text"
                      name="inabilityExplanation"
                      value={formData.inabilityExplanation}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    Are you willing to submit to the background records check
                    process as required by State of Georgia for all child care
                    center employees?
                  </td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="willSubmitToBackgroundCheck"
                        checked={formData.willSubmitToBackgroundCheck}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="willSubmitToBackgroundCheck"
                        checked={!formData.willSubmitToBackgroundCheck}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            willSubmitToBackgroundCheck: !e.target.checked,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    If you are applying for the Directors position are you
                    willing to submit to the Fingerprint Records Check process
                    are required by State of Georgia?
                  </td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="willSubmitToFingerprintCheck"
                        checked={formData.willSubmitToFingerprintCheck}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="willSubmitToFingerprintCheck"
                        checked={!formData.willSubmitToFingerprintCheck}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            willSubmitToFingerprintCheck: !e.target.checked,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Do you have a valid driver's license?</td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="hasValidDriversLicense"
                        checked={formData.hasValidDriversLicense}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="hasValidDriversLicense"
                        checked={!formData.hasValidDriversLicense}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hasValidDriversLicense: !e.target.checked,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Have you had CPR training with in the past two years?</td>
                  <td>
                    <div className="flex">
                      <label>YES</label>
                      <input
                        type="checkbox"
                        name="hasCprTraining"
                        checked={formData.hasCprTraining}
                        onChange={handleInputChange}
                      />
                      <label>NO</label>
                      <input
                        type="checkbox"
                        name="hasCprTraining"
                        checked={!formData.hasCprTraining}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hasCprTraining: !e.target.checked,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Previous Employment Section */}
          <div className="section_header">
            <h4>Previous employment</h4>
          </div>

          {/* First Employment */}
          <div className="flex">
            <label>Company:</label>
            <input
              type="text"
              name="previousEmployment.0.company"
              value={formData.previousEmployment[0].company}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="previousEmployment.0.phone"
              value={formData.previousEmployment[0].phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Address:</label>
            <input
              type="text"
              name="previousEmployment.0.address"
              value={formData.previousEmployment[0].address}
              onChange={handleInputChange}
            />
            <label>Supervisor:</label>
            <input
              type="text"
              name="previousEmployment.0.supervisor"
              value={formData.previousEmployment[0].supervisor}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Job Title:</label>
            <input
              type="text"
              name="previousEmployment.0.jobTitle"
              value={formData.previousEmployment[0].jobTitle}
              onChange={handleInputChange}
            />
            <label>Starting Salary:</label>
            <input
              type="text"
              placeholder="$"
              name="previousEmployment.0.startingSalary"
              value={formData.previousEmployment[0].startingSalary}
              onChange={handleInputChange}
            />
            <label>Ending Salary:</label>
            <input
              type="text"
              placeholder="$"
              name="previousEmployment.0.endingSalary"
              value={formData.previousEmployment[0].endingSalary}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Responsibilities:</label>
            <input
              type="text"
              name="previousEmployment.0.responsibilities"
              value={formData.previousEmployment[0].responsibilities}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>From:</label>
            <input
              type="text"
              name="previousEmployment.0.fromDate"
              value={formData.previousEmployment[0].fromDate}
              onChange={handleInputChange}
            />
            <label>To:</label>
            <input
              type="text"
              name="previousEmployment.0.toDate"
              value={formData.previousEmployment[0].toDate}
              onChange={handleInputChange}
            />
            <label>Reason for Leaving:</label>
            <input
              type="text"
              name="previousEmployment.0.reasonForLeaving"
              value={formData.previousEmployment[0].reasonForLeaving}
              onChange={handleInputChange}
            />
          </div>

          {/* Second Employment */}
          <div className="flex">
            <label>Company:</label>
            <input
              type="text"
              name="previousEmployment.1.company"
              value={formData.previousEmployment[1].company}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="previousEmployment.1.phone"
              value={formData.previousEmployment[1].phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Address:</label>
            <input
              type="text"
              name="previousEmployment.1.address"
              value={formData.previousEmployment[1].address}
              onChange={handleInputChange}
            />
            <label>Supervisor:</label>
            <input
              type="text"
              name="previousEmployment.1.supervisor"
              value={formData.previousEmployment[1].supervisor}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Job Title:</label>
            <input
              type="text"
              name="previousEmployment.1.jobTitle"
              value={formData.previousEmployment[1].jobTitle}
              onChange={handleInputChange}
            />
            <label>Starting Salary:</label>
            <input
              type="text"
              placeholder="$"
              name="previousEmployment.1.startingSalary"
              value={formData.previousEmployment[1].startingSalary}
              onChange={handleInputChange}
            />
            <label>Ending Salary:</label>
            <input
              type="text"
              placeholder="$"
              name="previousEmployment.1.endingSalary"
              value={formData.previousEmployment[1].endingSalary}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Responsibilities:</label>
            <input
              type="text"
              name="previousEmployment.1.responsibilities"
              value={formData.previousEmployment[1].responsibilities}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>From:</label>
            <input
              type="text"
              name="previousEmployment.1.fromDate"
              value={formData.previousEmployment[1].fromDate}
              onChange={handleInputChange}
            />
            <label>To:</label>
            <input
              type="text"
              name="previousEmployment.1.toDate"
              value={formData.previousEmployment[1].toDate}
              onChange={handleInputChange}
            />
            <label>Reason for Leaving:</label>
            <input
              type="text"
              name="previousEmployment.1.reasonForLeaving"
              value={formData.previousEmployment[1].reasonForLeaving}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>
              May we contact your previous supervisor for a reference?
            </label>
            <div>
              <label>YES</label>
              <input
                type="checkbox"
                name="previousEmployment.1.canContact"
                checked={formData.previousEmployment[1].canContact}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>NO</label>
              <input
                type="checkbox"
                checked={!formData.previousEmployment[1].canContact}
                onChange={(e) => {
                  const updatedEmployment = [...formData.previousEmployment];
                  updatedEmployment[1] = {
                    ...updatedEmployment[1],
                    canContact: !e.target.checked,
                  };
                  setFormData({
                    ...formData,
                    previousEmployment: updatedEmployment,
                  });
                }}
              />
            </div>
          </div>

          <div className="divider"></div>

          {/* Third Employment */}
          <div className="flex">
            <label>Company:</label>
            <input
              type="text"
              name="previousEmployment.2.company"
              value={formData.previousEmployment[2].company}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="previousEmployment.2.phone"
              value={formData.previousEmployment[2].phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Address:</label>
            <input
              type="text"
              name="previousEmployment.2.address"
              value={formData.previousEmployment[2].address}
              onChange={handleInputChange}
            />
            <label>Supervisor:</label>
            <input
              type="text"
              name="previousEmployment.2.supervisor"
              value={formData.previousEmployment[2].supervisor}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Job Title:</label>
            <input
              type="text"
              name="previousEmployment.2.jobTitle"
              value={formData.previousEmployment[2].jobTitle}
              onChange={handleInputChange}
            />
            <label>Starting Salary:</label>
            <input
              type="text"
              placeholder="$"
              name="previousEmployment.2.startingSalary"
              value={formData.previousEmployment[2].startingSalary}
              onChange={handleInputChange}
            />
            <label>Ending Salary:</label>
            <input
              type="text"
              placeholder="$"
              name="previousEmployment.2.endingSalary"
              value={formData.previousEmployment[2].endingSalary}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>Responsibilities:</label>
            <input
              type="text"
              name="previousEmployment.2.responsibilities"
              value={formData.previousEmployment[2].responsibilities}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex">
            <label>From:</label>
            <input
              type="text"
              name="previousEmployment.2.fromDate"
              value={formData.previousEmployment[2].fromDate}
              onChange={handleInputChange}
            />
            <label>To:</label>
            <input
              type="text"
              name="previousEmployment.2.toDate"
              value={formData.previousEmployment[2].toDate}
              onChange={handleInputChange}
            />
            <label>Reason for Leaving:</label>
            <input
              type="text"
              name="previousEmployment.2.reasonForLeaving"
              value={formData.previousEmployment[2].reasonForLeaving}
              onChange={handleInputChange}
            />
          </div>

          {/* Questionnaire Section */}
          <div className="section_header">
            <h4>Questionnaire</h4>
          </div>

          <ol>
            <li>
              <p>
                When dealing with children what is the most important tool you
                should have?
              </p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.importantToolForChildren.0"
                          value={
                            formData.questionnaire.importantToolForChildren[0]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.importantToolForChildren.1"
                          value={
                            formData.questionnaire.importantToolForChildren[1]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.importantToolForChildren.2"
                          value={
                            formData.questionnaire.importantToolForChildren[2]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>How do you feel about yelling at children?</p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.feelingsAboutYelling.0"
                          value={formData.questionnaire.feelingsAboutYelling[0]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.feelingsAboutYelling.1"
                          value={formData.questionnaire.feelingsAboutYelling[1]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.feelingsAboutYelling.2"
                          value={formData.questionnaire.feelingsAboutYelling[2]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>
                When having a conflict with another employee or a parent, how
                would you deal with the situation?
              </p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.handlingConflicts.0"
                          value={formData.questionnaire.handlingConflicts[0]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.handlingConflicts.1"
                          value={formData.questionnaire.handlingConflicts[1]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.handlingConflicts.2"
                          value={formData.questionnaire.handlingConflicts[2]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>
                How do you feel about coming to work with a negative attitude?
              </p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.negativeAttitude.0"
                          value={formData.questionnaire.negativeAttitude[0]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.negativeAttitude.1"
                          value={formData.questionnaire.negativeAttitude[1]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.negativeAttitude.2"
                          value={formData.questionnaire.negativeAttitude[2]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>Why would you want to work in a child care facility?</p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.reasonToWorkInChildcare.0"
                          value={
                            formData.questionnaire.reasonToWorkInChildcare[0]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.reasonToWorkInChildcare.1"
                          value={
                            formData.questionnaire.reasonToWorkInChildcare[1]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.reasonToWorkInChildcare.2"
                          value={
                            formData.questionnaire.reasonToWorkInChildcare[2]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>
                When a parent and child enter a classroom, how would you greet
                them?
              </p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.greetingParentsAndChildren.0"
                          value={
                            formData.questionnaire.greetingParentsAndChildren[0]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.greetingParentsAndChildren.1"
                          value={
                            formData.questionnaire.greetingParentsAndChildren[1]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.greetingParentsAndChildren.2"
                          value={
                            formData.questionnaire.greetingParentsAndChildren[2]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>How do you feel about praising a child?</p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.praisingChildren.0"
                          value={formData.questionnaire.praisingChildren[0]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.praisingChildren.1"
                          value={formData.questionnaire.praisingChildren[1]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.praisingChildren.2"
                          value={formData.questionnaire.praisingChildren[2]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>
                When disciplining a child what is the most important message you
                need to tell them?
              </p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.disciplineMessage.0"
                          value={formData.questionnaire.disciplineMessage[0]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.disciplineMessage.1"
                          value={formData.questionnaire.disciplineMessage[1]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.disciplineMessage.2"
                          value={formData.questionnaire.disciplineMessage[2]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>Do you believe in telling a child that he or she is bad?</p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.tellingChildIsBad.0"
                          value={formData.questionnaire.tellingChildIsBad[0]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.tellingChildIsBad.1"
                          value={formData.questionnaire.tellingChildIsBad[1]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.tellingChildIsBad.2"
                          value={formData.questionnaire.tellingChildIsBad[2]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <p>What do you like most about working with children?</p>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.enjoymentFromWorkingWithChildren.0"
                          value={
                            formData.questionnaire
                              .enjoymentFromWorkingWithChildren[0]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.enjoymentFromWorkingWithChildren.1"
                          value={
                            formData.questionnaire
                              .enjoymentFromWorkingWithChildren[1]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="questionnaire.enjoymentFromWorkingWithChildren.2"
                          value={
                            formData.questionnaire
                              .enjoymentFromWorkingWithChildren[2]
                          }
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <div className="flex align_center">
                <p>
                  Have you ever held a child care license with the Department of
                  Children and Families or been registered to provide child care
                  in your home?
                </p>
                <div className="flex align_center">
                  <label>Yes</label>
                  <input
                    type="checkbox"
                    name="questionnaire.hasHeldChildcareLicense"
                    checked={formData.questionnaire.hasHeldChildcareLicense}
                    onChange={handleInputChange}
                  />
                  <p>or</p>
                  <label>No</label>
                  <input
                    type="checkbox"
                    checked={!formData.questionnaire.hasHeldChildcareLicense}
                    onChange={(e) => {
                      const updatedQuestionnaire = {
                        ...formData.questionnaire,
                        hasHeldChildcareLicense: !e.target.checked,
                      };
                      setFormData({
                        ...formData,
                        questionnaire: updatedQuestionnaire,
                      });
                    }}
                  />
                </div>
              </div>
            </li>
            {/* Disciplinary Action Question */}
            <li>
              <p>
                While employed in a child care program, have you ever been the
                subject of disciplinary action, or been the part responsible for
                a child care facility receiving administrative fine or other
                disciplinary action?
              </p>
              <div className="flex align_center">
                <label>Yes</label>
                <input
                  type="checkbox"
                  name="hasBeenDisciplined"
                  checked={formData.hasBeenDisciplined}
                  onChange={handleInputChange}
                />
                <p>or</p>
                <label>No</label>
                <input
                  type="checkbox"
                  name="hasBeenDisciplined"
                  checked={!formData.hasBeenDisciplined}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasBeenDisciplined: !e.target.checked,
                    })
                  }
                />
              </div>
              <div className="questionnaire">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="disciplinaryExplanation.0"
                          value={formData.disciplinaryExplanation[0]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="disciplinaryExplanation.1"
                          value={formData.disciplinaryExplanation[1]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          name="disciplinaryExplanation.2"
                          value={formData.disciplinaryExplanation[2]}
                          onChange={handleInputChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
          </ol>

          {/* References Section */}
          <div className="section_header">
            <h4>References</h4>
          </div>
          <i>Please list three professional references.</i>

          {/* First Reference */}
          <div className="flex align_center">
            <label>Full Name:</label>
            <input
              type="text"
              name="references.0.fullName"
              value={formData.references[0].fullName}
              onChange={handleInputChange}
            />
            <label>Relationship:</label>
            <input
              type="text"
              name="references.0.relationship"
              value={formData.references[0].relationship}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>Company:</label>
            <input
              type="text"
              name="references.0.company"
              value={formData.references[0].company}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="references.0.phone"
              value={formData.references[0].phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>Address:</label>
            <input
              type="text"
              name="references.0.address"
              value={formData.references[0].address}
              onChange={handleInputChange}
            />
          </div>
          <div className="divider"></div>

          {/* Second Reference */}
          <div className="flex align_center">
            <label>Full Name:</label>
            <input
              type="text"
              name="references.1.fullName"
              value={formData.references[1].fullName}
              onChange={handleInputChange}
            />
            <label>Relationship:</label>
            <input
              type="text"
              name="references.1.relationship"
              value={formData.references[1].relationship}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>Company:</label>
            <input
              type="text"
              name="references.1.company"
              value={formData.references[1].company}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="references.1.phone"
              value={formData.references[1].phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>Address:</label>
            <input
              type="text"
              name="references.1.address"
              value={formData.references[1].address}
              onChange={handleInputChange}
            />
          </div>
          <div className="divider"></div>

          {/* Third Reference */}
          <div className="flex align_center">
            <label>Full Name:</label>
            <input
              type="text"
              name="references.2.fullName"
              value={formData.references[2].fullName}
              onChange={handleInputChange}
            />
            <label>Relationship:</label>
            <input
              type="text"
              name="references.2.relationship"
              value={formData.references[2].relationship}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>Company:</label>
            <input
              type="text"
              name="references.2.company"
              value={formData.references[2].company}
              onChange={handleInputChange}
            />
            <label>Phone:</label>
            <input
              type="text"
              name="references.2.phone"
              value={formData.references[2].phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>Address:</label>
            <input
              type="text"
              name="references.2.address"
              value={formData.references[2].address}
              onChange={handleInputChange}
            />
          </div>
          <div className="divider"></div>

          {/* Military Service Section */}
          <div className="section_header">
            <h4>Military Service</h4>
          </div>
          <div className="flex align_center">
            <label>Branch:</label>
            <input
              type="text"
              name="militaryService.branch"
              value={formData.militaryService.branch}
              onChange={handleInputChange}
            />
            <label>From:</label>
            <input
              type="text"
              name="militaryService.fromDate"
              value={formData.militaryService.fromDate}
              onChange={handleInputChange}
            />
            <label>To:</label>
            <input
              type="text"
              name="militaryService.toDate"
              value={formData.militaryService.toDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>Rank at Discharge:</label>
            <input
              type="text"
              name="militaryService.rankAtDischarge"
              value={formData.militaryService.rankAtDischarge}
              onChange={handleInputChange}
            />
            <label>Type of Discharge:</label>
            <input
              type="text"
              name="militaryService.dischargeType"
              value={formData.militaryService.dischargeType}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex align_center">
            <label>If other than honorable, explain:</label>
            <input
              type="text"
              name="militaryService.dischargeExplanation"
              value={formData.militaryService.dischargeExplanation}
              onChange={handleInputChange}
            />
          </div>

          {/* Disclaimer and Signature Section */}
          <div className="section_header">
            <h4>Disclaimer and Signature</h4>
          </div>

          <i>
            "I certify that the facts contained in this application are true and
            complete to the best of my knowledge and understand that, if
            employed, falsified statements on this application shall be grounds
            for dismissal. I authorized investigation of all statements herein
            and the references and employers listed above to five you any
            liability for any damage that may result from utilization of such
            information. I also understand and agree that no representative of
            the company has any authority to enter into any agreement for
            employment for any specified period, or to make any agreement
            contrary to the foregoing, unless it is in writing and signed by an
            authorized company representative. This waiver does not permit the
            release or use of disability-related or medical information in a
            manner prohibited by the American with Disabilities Act (ADA) and
            other relevant federal and state laws."
          </i>

          <div className="flex align_center space_btw">
            {/* <label>Signature:</label>
            <input
              type="text"
              name="signature"
              value={formData.signature}
              onChange={handleInputChange}
            /> */}
            <div>
              <label>Signature:</label>
              <Signature onSave={handleSignatureSave} />
            </div>
            <div>
              <label>Date:</label>
              <input
                type="date"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button
            id="i9_button"
            type="submit"
            disabled={isSubmitting || !formData.signature}
          >
            {isSubmitting ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
