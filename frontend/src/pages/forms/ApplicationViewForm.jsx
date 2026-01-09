import { useState, useEffect, useContext } from "react";
//  import "../../styles/I9Form.module.css";
import "../../styles/I9Form.css";
import Signature from "../../components/Signature";
import { AuthContext } from "../../context/AuthContext";
import {
  getApplication,
  getUser,
  submitJobApplication,
  updateJobApplication,
  upgradeToL6,
  getDocument,
} from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import InterviewNotesPopup from "../../components/InterviewNotesPopup";

export default function ApplicationViewForm() {
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  // Initialize all form fields in a single state object
  const [formData, setFormData] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const navigate = useNavigate();

  const [showInterviewNotes, setShowInterviewNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedId, setUploadedId] = useState(false);

  const fetchForm = async () => {
    const data = await getApplication(id, token);
    setFormData(data.data);
  };

  const fetchUserStatus = async () => {
    const data = await getUser(formData?.user._id, token);
    setUserRole(data.role);
  };

  const checkUploadedDocument = async () => {
    const data = await getDocument(formData?.user._id, token);

    if (data.documents.length > 0) {
      setUploadedId(true);
    }
  };

  // Universal handler function for all form inputs
  const handleInputChange = (e) => {
    const { name, defaultValue, type, checked } = e.target;

    // Handle special cases with nested objects/arrays
    if (name.includes(".")) {
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
            [nestedField]: type === "checkbox" ? checked : defaultValue,
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
          updatedArray[index] = defaultValue;
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
            [field]: type === "checkbox" ? checked : defaultValue,
          },
        }));
      }
    } else {
      // Handle regular inputs
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : defaultValue,
      }));
    }
  };

  const upgrade = async () => {
    setLoading(true);
    const response = await upgradeToL6(formData.user._id, token);
    navigate(`/application/${user.branch}`);

    if (response) {
      navigate(`/application/${user.branch}`);
    }

    setLoading(false);
  };

  const handleSaveInterviewNotes = async (notes) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Update the job application with the new interview notes
      const response = await updateJobApplication(
        id,
        { interviewNotes: notes },
        token
      );

      // Update local state
      setFormData((prevState) => ({
        ...prevState,
        interviewNotes: notes,
      }));

      alert("Interview notes saved successfully");
    } catch (error) {
      console.error("Error saving interview notes:", error);
      alert("Failed to save interview notes");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, []);

  useEffect(() => {
    if (formData) {
      fetchUserStatus();
      checkUploadedDocument();
    }
  }, [formData]);

  if (!formData) {
    return <div>Loading</div>;
  }

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

        <button
          className="approve-button"
          onClick={upgrade}
          disabled={userRole == "L5" || loading}
        >
          {userRole == "L5" ? "User Upgraded to L5" : "Upgrade to L5"}
        </button>

        <button
          className="approve-button"
          onClick={() => setShowInterviewNotes(true)}
        >
          Interview Notes
        </button>

        {uploadedId && (
          <button
            className="approve-button"
            onClick={() => navigate(`/documents/${formData?.user._id}`)}
          >
            Submitted Documents
          </button>
        )}

        <InterviewNotesPopup
          isOpen={showInterviewNotes}
          onClose={() => setShowInterviewNotes(false)}
          notes={formData.interviewNotes}
          onSave={handleSaveInterviewNotes}
          applicationId={id}
          token={token}
        />

        <form>
          <fieldset disabled>
            {/* Applicant Information */}
            <div className="flex align_center">
              <div className="flex align_center">
                <label>Full Name: </label>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={formData.lastName}
                  />
                  <label>Last</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={formData.firstName}
                  />
                  <label>First</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="middleName"
                    defaultValue={formData.middleName}
                  />
                  <label>M.I</label>
                </div>
              </div>
              <div className="flex align_center">
                <label className="special_label">Date: </label>
                <input type="date" name="date" defaultValue={formData.date} />
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
                    defaultValue={formData.streetAddress}
                  />
                  <label>Street Address</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="apartmentUnit"
                    defaultValue={formData.apartmentUnit}
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
                  <input type="text" name="city" defaultValue={formData.city} />
                  <label>City</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="state"
                    defaultValue={formData.state}
                  />
                  <label>State</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="zipCode"
                    defaultValue={formData.zipCode}
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
                    defaultValue={formData.streetAddressTwo}
                  />
                  <label>Street Address</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="apartmentUnitTwo"
                    defaultValue={formData.apartmentUnitTwo}
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
                    defaultValue={formData.cityTwo}
                  />
                  <label>City</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="stateTwo"
                    defaultValue={formData.stateTwo}
                  />
                  <label>State</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="zipCodeTwo"
                    defaultValue={formData.zipCodeTwo}
                  />
                  <label>ZIP Code</label>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex align_center">
              <label>Phone:</label>
              <input type="text" name="phone" defaultValue={formData.phone} />

              <label>Email:</label>
              <input type="text" name="email" defaultValue={formData.email} />
            </div>

            {/* Job Details */}
            <div className="flex align_center">
              <label>Date Available:</label>
              <input
                type="date"
                name="dateAvailable"
                defaultValue={formData.dateAvailable}
              />

              <label>Desired Salary:</label>
              <input
                type="text"
                placeholder="$"
                name="desiredSalary"
                defaultValue={formData.desiredSalary}
              />
            </div>

            <div className="flex align_center">
              <label>Position Applied for:</label>
              <input
                type="text"
                name="position"
                defaultValue={formData.position}
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
                defaultValue={formData.previousEmploymentDate}
                disabled={!formData.hasWorkedForCompany}
              />
            </div>

            {/* Hours sought */}
            <div className="flex align_center">
              <div className="flex align_center">
                <label>Hours sought:</label>
                <div className="flex">
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
              defaultValue={formData.felonyExplanation}
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
                    defaultValue={edu.schoolName}
                  />
                  <label>Address:</label>
                  <input
                    type="text"
                    name={`education.${index}.address`}
                    defaultValue={edu.address}
                  />
                </div>

                <div className="flex align_center">
                  <label>From:</label>
                  <input
                    type="text"
                    name={`education.${index}.fromDate`}
                    defaultValue={edu.fromDate}
                  />
                  <label>To:</label>
                  <input
                    type="text"
                    name={`education.${index}.toDate`}
                    defaultValue={edu.toDate}
                  />
                  <label>Did you graduate?</label>
                  <div>
                    <label>YES</label>
                    <input
                      type="checkbox"
                      name={`education.${index}.graduated`}
                      checked={edu.graduated}
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
                        setFormData({
                          ...formData,
                          education: updatedEducation,
                        });
                      }}
                    />
                  </div>
                  <label>Degree:</label>
                  <input
                    type="text"
                    name={`education.${index}.degree`}
                    defaultValue={edu.degree}
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
                        defaultValue={formData.criminalRecordExplanation}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Have you ever been shown by credible evidence e.g, a court
                      order or jury, a department investigation or other
                      reliable evidence to have abused, neglected or deprived a
                      child or adult or to have subjected any person to serious
                      injury because of intentional or grossly negligent
                      misconduct?
                    </td>
                    <td>
                      <div className="flex">
                        <label>YES</label>
                        <input
                          type="checkbox"
                          name="hasAbusedOrNeglected"
                          checked={formData.hasAbusedOrNeglected}
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
                            defaultValue={formData.abuseExplanation}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      Under the American with Disabilities Act of 1991, this
                      program is required to reasonably accommodate individuals
                      with a disability. The reasonable accommodation
                      requirement applies to the application process, any
                      pre-employment testing, interviews, and actual employment,
                      but only if the program supervisor is made aware that an
                      accommodation is required. If you are disabled and require
                      accommodation, you may request it at any time during the
                      interview process. You are obligated to inform the program
                      director of your needs if it will impact your ability to
                      preform the job for which you are applying.
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
                        defaultValue={formData.inabilityExplanation}
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
                    <td>
                      Have you had CPR training with in the past two years?
                    </td>
                    <td>
                      <div className="flex">
                        <label>YES</label>
                        <input
                          type="checkbox"
                          name="hasCprTraining"
                          checked={formData.hasCprTraining}
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
                defaultValue={formData.previousEmployment[0].company}
              />
              <label>Phone:</label>
              <input
                type="text"
                name="previousEmployment.0.phone"
                defaultValue={formData.previousEmployment[0].phone}
              />
            </div>

            <div className="flex">
              <label>Address:</label>
              <input
                type="text"
                name="previousEmployment.0.address"
                defaultValue={formData.previousEmployment[0].address}
              />
              <label>Supervisor:</label>
              <input
                type="text"
                name="previousEmployment.0.supervisor"
                defaultValue={formData.previousEmployment[0].supervisor}
              />
            </div>

            <div className="flex">
              <label>Job Title:</label>
              <input
                type="text"
                name="previousEmployment.0.jobTitle"
                defaultValue={formData.previousEmployment[0].jobTitle}
              />
              <label>Starting Salary:</label>
              <input
                type="text"
                placeholder="$"
                name="previousEmployment.0.startingSalary"
                defaultValue={formData.previousEmployment[0].startingSalary}
              />
              <label>Ending Salary:</label>
              <input
                type="text"
                placeholder="$"
                name="previousEmployment.0.endingSalary"
                defaultValue={formData.previousEmployment[0].endingSalary}
              />
            </div>

            <div className="flex">
              <label>Responsibilities:</label>
              <input
                type="text"
                name="previousEmployment.0.responsibilities"
                defaultValue={formData.previousEmployment[0].responsibilities}
              />
            </div>

            <div className="flex">
              <label>From:</label>
              <input
                type="text"
                name="previousEmployment.0.fromDate"
                defaultValue={formData.previousEmployment[0].fromDate}
              />
              <label>To:</label>
              <input
                type="text"
                name="previousEmployment.0.toDate"
                defaultValue={formData.previousEmployment[0].toDate}
              />
              <label>Reason for Leaving:</label>
              <input
                type="text"
                name="previousEmployment.0.reasonForLeaving"
                defaultValue={formData.previousEmployment[0].reasonForLeaving}
              />
            </div>

            {/* Second Employment */}
            <div className="flex">
              <label>Company:</label>
              <input
                type="text"
                name="previousEmployment.1.company"
                defaultValue={formData.previousEmployment[1].company}
              />
              <label>Phone:</label>
              <input
                type="text"
                name="previousEmployment.1.phone"
                defaultValue={formData.previousEmployment[1].phone}
              />
            </div>

            <div className="flex">
              <label>Address:</label>
              <input
                type="text"
                name="previousEmployment.1.address"
                defaultValue={formData.previousEmployment[1].address}
              />
              <label>Supervisor:</label>
              <input
                type="text"
                name="previousEmployment.1.supervisor"
                defaultValue={formData.previousEmployment[1].supervisor}
              />
            </div>

            <div className="flex">
              <label>Job Title:</label>
              <input
                type="text"
                name="previousEmployment.1.jobTitle"
                defaultValue={formData.previousEmployment[1].jobTitle}
              />
              <label>Starting Salary:</label>
              <input
                type="text"
                placeholder="$"
                name="previousEmployment.1.startingSalary"
                defaultValue={formData.previousEmployment[1].startingSalary}
              />
              <label>Ending Salary:</label>
              <input
                type="text"
                placeholder="$"
                name="previousEmployment.1.endingSalary"
                defaultValue={formData.previousEmployment[1].endingSalary}
              />
            </div>

            <div className="flex">
              <label>Responsibilities:</label>
              <input
                type="text"
                name="previousEmployment.1.responsibilities"
                defaultValue={formData.previousEmployment[1].responsibilities}
              />
            </div>

            <div className="flex">
              <label>From:</label>
              <input
                type="text"
                name="previousEmployment.1.fromDate"
                defaultValue={formData.previousEmployment[1].fromDate}
              />
              <label>To:</label>
              <input
                type="text"
                name="previousEmployment.1.toDate"
                defaultValue={formData.previousEmployment[1].toDate}
              />
              <label>Reason for Leaving:</label>
              <input
                type="text"
                name="previousEmployment.1.reasonForLeaving"
                defaultValue={formData.previousEmployment[1].reasonForLeaving}
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
                defaultValue={formData.previousEmployment[2].company}
              />
              <label>Phone:</label>
              <input
                type="text"
                name="previousEmployment.2.phone"
                defaultValue={formData.previousEmployment[2].phone}
              />
            </div>

            <div className="flex">
              <label>Address:</label>
              <input
                type="text"
                name="previousEmployment.2.address"
                defaultValue={formData.previousEmployment[2].address}
              />
              <label>Supervisor:</label>
              <input
                type="text"
                name="previousEmployment.2.supervisor"
                defaultValue={formData.previousEmployment[2].supervisor}
              />
            </div>

            <div className="flex">
              <label>Job Title:</label>
              <input
                type="text"
                name="previousEmployment.2.jobTitle"
                defaultValue={formData.previousEmployment[2].jobTitle}
              />
              <label>Starting Salary:</label>
              <input
                type="text"
                placeholder="$"
                name="previousEmployment.2.startingSalary"
                defaultValue={formData.previousEmployment[2].startingSalary}
              />
              <label>Ending Salary:</label>
              <input
                type="text"
                placeholder="$"
                name="previousEmployment.2.endingSalary"
                defaultValue={formData.previousEmployment[2].endingSalary}
              />
            </div>

            <div className="flex">
              <label>Responsibilities:</label>
              <input
                type="text"
                name="previousEmployment.2.responsibilities"
                defaultValue={formData.previousEmployment[2].responsibilities}
              />
            </div>

            <div className="flex">
              <label>From:</label>
              <input
                type="text"
                name="previousEmployment.2.fromDate"
                defaultValue={formData.previousEmployment[2].fromDate}
              />
              <label>To:</label>
              <input
                type="text"
                name="previousEmployment.2.toDate"
                defaultValue={formData.previousEmployment[2].toDate}
              />
              <label>Reason for Leaving:</label>
              <input
                type="text"
                name="previousEmployment.2.reasonForLeaving"
                defaultValue={formData.previousEmployment[2].reasonForLeaving}
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
                            defaultValue={
                              formData.questionnaire.importantToolForChildren[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.importantToolForChildren.1"
                            defaultValue={
                              formData.questionnaire.importantToolForChildren[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.importantToolForChildren.2"
                            defaultValue={
                              formData.questionnaire.importantToolForChildren[2]
                            }
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
                            defaultValue={
                              formData.questionnaire.feelingsAboutYelling[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.feelingsAboutYelling.1"
                            defaultValue={
                              formData.questionnaire.feelingsAboutYelling[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.feelingsAboutYelling.2"
                            defaultValue={
                              formData.questionnaire.feelingsAboutYelling[2]
                            }
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
                            defaultValue={
                              formData.questionnaire.handlingConflicts[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.handlingConflicts.1"
                            defaultValue={
                              formData.questionnaire.handlingConflicts[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.handlingConflicts.2"
                            defaultValue={
                              formData.questionnaire.handlingConflicts[2]
                            }
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
                            defaultValue={
                              formData.questionnaire.negativeAttitude[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.negativeAttitude.1"
                            defaultValue={
                              formData.questionnaire.negativeAttitude[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.negativeAttitude.2"
                            defaultValue={
                              formData.questionnaire.negativeAttitude[2]
                            }
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
                            defaultValue={
                              formData.questionnaire.reasonToWorkInChildcare[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.reasonToWorkInChildcare.1"
                            defaultValue={
                              formData.questionnaire.reasonToWorkInChildcare[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.reasonToWorkInChildcare.2"
                            defaultValue={
                              formData.questionnaire.reasonToWorkInChildcare[2]
                            }
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
                            defaultValue={
                              formData.questionnaire
                                .greetingParentsAndChildren[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.greetingParentsAndChildren.1"
                            defaultValue={
                              formData.questionnaire
                                .greetingParentsAndChildren[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.greetingParentsAndChildren.2"
                            defaultValue={
                              formData.questionnaire
                                .greetingParentsAndChildren[2]
                            }
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
                            defaultValue={
                              formData.questionnaire.praisingChildren[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.praisingChildren.1"
                            defaultValue={
                              formData.questionnaire.praisingChildren[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.praisingChildren.2"
                            defaultValue={
                              formData.questionnaire.praisingChildren[2]
                            }
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </li>
              <li>
                <p>
                  When disciplining a child what is the most important message
                  you need to tell them?
                </p>
                <div className="questionnaire">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.disciplineMessage.0"
                            defaultValue={
                              formData.questionnaire.disciplineMessage[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.disciplineMessage.1"
                            defaultValue={
                              formData.questionnaire.disciplineMessage[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.disciplineMessage.2"
                            defaultValue={
                              formData.questionnaire.disciplineMessage[2]
                            }
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
                            defaultValue={
                              formData.questionnaire.tellingChildIsBad[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.tellingChildIsBad.1"
                            defaultValue={
                              formData.questionnaire.tellingChildIsBad[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.tellingChildIsBad.2"
                            defaultValue={
                              formData.questionnaire.tellingChildIsBad[2]
                            }
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
                            defaultValue={
                              formData.questionnaire
                                .enjoymentFromWorkingWithChildren[0]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.enjoymentFromWorkingWithChildren.1"
                            defaultValue={
                              formData.questionnaire
                                .enjoymentFromWorkingWithChildren[1]
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="questionnaire.enjoymentFromWorkingWithChildren.2"
                            defaultValue={
                              formData.questionnaire
                                .enjoymentFromWorkingWithChildren[2]
                            }
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
                    Have you ever held a child care license with the Department
                    of Children and Families or been registered to provide child
                    care in your home?
                  </p>
                  <div className="flex align_center">
                    <label>Yes</label>
                    <input
                      type="checkbox"
                      name="questionnaire.hasHeldChildcareLicense"
                      checked={formData.questionnaire.hasHeldChildcareLicense}
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
                  subject of disciplinary action, or been the part responsible
                  for a child care facility receiving administrative fine or
                  other disciplinary action?
                </p>
                <div className="flex align_center">
                  <label>Yes</label>
                  <input
                    type="checkbox"
                    name="hasBeenDisciplined"
                    checked={formData.hasBeenDisciplined}
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
                            defaultValue={formData.disciplinaryExplanation[0]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="disciplinaryExplanation.1"
                            defaultValue={formData.disciplinaryExplanation[1]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="text"
                            name="disciplinaryExplanation.2"
                            defaultValue={formData.disciplinaryExplanation[2]}
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
                defaultValue={formData.references[0].fullName}
              />
              <label>Relationship:</label>
              <input
                type="text"
                name="references.0.relationship"
                defaultValue={formData.references[0].relationship}
              />
            </div>
            <div className="flex align_center">
              <label>Company:</label>
              <input
                type="text"
                name="references.0.company"
                defaultValue={formData.references[0].company}
              />
              <label>Phone:</label>
              <input
                type="text"
                name="references.0.phone"
                defaultValue={formData.references[0].phone}
              />
            </div>
            <div className="flex align_center">
              <label>Address:</label>
              <input
                type="text"
                name="references.0.address"
                defaultValue={formData.references[0].address}
              />
            </div>
            <div className="divider"></div>

            {/* Second Reference */}
            <div className="flex align_center">
              <label>Full Name:</label>
              <input
                type="text"
                name="references.1.fullName"
                defaultValue={formData.references[1].fullName}
              />
              <label>Relationship:</label>
              <input
                type="text"
                name="references.1.relationship"
                defaultValue={formData.references[1].relationship}
              />
            </div>
            <div className="flex align_center">
              <label>Company:</label>
              <input
                type="text"
                name="references.1.company"
                defaultValue={formData.references[1].company}
              />
              <label>Phone:</label>
              <input
                type="text"
                name="references.1.phone"
                defaultValue={formData.references[1].phone}
              />
            </div>
            <div className="flex align_center">
              <label>Address:</label>
              <input
                type="text"
                name="references.1.address"
                defaultValue={formData.references[1].address}
              />
            </div>
            <div className="divider"></div>

            {/* Third Reference */}
            <div className="flex align_center">
              <label>Full Name:</label>
              <input
                type="text"
                name="references.2.fullName"
                defaultValue={formData.references[2].fullName}
              />
              <label>Relationship:</label>
              <input
                type="text"
                name="references.2.relationship"
                defaultValue={formData.references[2].relationship}
              />
            </div>
            <div className="flex align_center">
              <label>Company:</label>
              <input
                type="text"
                name="references.2.company"
                defaultValue={formData.references[2].company}
              />
              <label>Phone:</label>
              <input
                type="text"
                name="references.2.phone"
                defaultValue={formData.references[2].phone}
              />
            </div>
            <div className="flex align_center">
              <label>Address:</label>
              <input
                type="text"
                name="references.2.address"
                defaultValue={formData.references[2].address}
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
                defaultValue={formData.militaryService.branch}
              />
              <label>From:</label>
              <input
                type="text"
                name="militaryService.fromDate"
                defaultValue={formData.militaryService.fromDate}
              />
              <label>To:</label>
              <input
                type="text"
                name="militaryService.toDate"
                defaultValue={formData.militaryService.toDate}
              />
            </div>
            <div className="flex align_center">
              <label>Rank at Discharge:</label>
              <input
                type="text"
                name="militaryService.rankAtDischarge"
                defaultValue={formData.militaryService.rankAtDischarge}
              />
              <label>Type of Discharge:</label>
              <input
                type="text"
                name="militaryService.dischargeType"
                defaultValue={formData.militaryService.dischargeType}
              />
            </div>
            <div className="flex align_center">
              <label>If other than honorable, explain:</label>
              <input
                type="text"
                name="militaryService.dischargeExplanation"
                defaultValue={formData.militaryService.dischargeExplanation}
              />
            </div>

            {/* Disclaimer and Signature Section */}
            <div className="section_header">
              <h4>Disclaimer and Signature</h4>
            </div>

            <i>
              "I certify that the facts contained in this application are true
              and complete to the best of my knowledge and understand that, if
              employed, falsified statements on this application shall be
              grounds for dismissal. I authorized investigation of all
              statements herein and the references and employers listed above to
              five you any liability for any damage that may result from
              utilization of such information. I also understand and agree that
              no representative of the company has any authority to enter into
              any agreement for employment for any specified period, or to make
              any agreement contrary to the foregoing, unless it is in writing
              and signed by an authorized company representative. This waiver
              does not permit the release or use of disability-related or
              medical information in a manner prohibited by the American with
              Disabilities Act (ADA) and other relevant federal and state laws."
            </i>

            <div className="flex space_btw">
              <div>
                <label>Signature:</label>
                <img src={formData.signature} style={{ display: "block" }} />
              </div>

              <div>
                <label>Date:</label>
                <input
                  type="date"
                  name="signatureDate"
                  defaultValue={formData.signatureDate}
                />
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
