import { useState, useEffect, useContext } from "react";
//  import "../../styles/I9Form.module.css";
import "../../styles/I9Form.css";
import Signature from "../../components/Signature";
import { AuthContext } from "../../context/AuthContext";
import {
  getApplication,
  submitJobApplication,
  upgradeToL6,
} from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ApplicationViewForm() {
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const { user } = useContext(AuthContext);
  // Initialize all form fields in a single state object
  const [formData, setFormData] = useState(false);
  const navigate = useNavigate();

  const fetchForm = async () => {
    const data = await getApplication(id, token);
    setFormData(data.data);
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
    const response = await upgradeToL6(formData.user._id, token);
  };

  useEffect(() => {
    fetchForm();
  }, []);

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

        <button className="approve-button" onClick={upgrade}>
          Upgrade to L5
        </button>

        <button className="approve-button">Interview Notes</button>

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
