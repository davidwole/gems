import { useState, useEffect, useContext } from "react";
import "../../styles/IESForm.css";
import { AuthContext } from "../../context/AuthContext";
import {
  API_URL,
  signEnrollmentForm,
  submitEnrollmentForm,
} from "../../services/api";
import Signature from "../../components/Signature";
import { useParams } from "react-router-dom";

export default function IESFormFilled() {
  const { user, token } = useContext(AuthContext);
  const { userId, enrollmentformId } = useParams();

  const [formData, setFormdata] = useState(false);
  const [signatures, setSignatures] = useState({
    determiningSignature: "",
    determiningSignatureDate: "",
    confirmingSignature: "",
    confirmingSignatureDate: "",
    followUpSignature: "",
    followUpSignatureDate: "",
  });

  const fetchForm = async () => {
    const response = await fetch(`${API_URL}/ies-forms/${enrollmentformId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    console.log(data);
    setFormdata(data[0]);
  };

  const handleSignatureSave = (dataUrl, name) => {
    setSignatures((prev) => ({
      ...prev,
      [name]: dataUrl,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    setSignatures((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signEnrollmentForm(signatures, id);
      console.log(result);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  useEffect(() => {
    fetchForm();
  }, []);

  if (!formData) {
    return <div>Loading....</div>;
  }

  console.log(formData);
  return (
    <div className="ies">
      <h3 className="heading">
        CACFP Meal Benefit Income Eligibility Statement
      </h3>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            {/* <fieldset disabled> */}
            <tr>
              <td colSpan={7} className="parts-header">
                PART I: Child(ren) or Adult enrolled to receive day care
              </td>
            </tr>

            <tr>
              <td rowSpan={2} className="col-45 name-label">
                Name: (Last, First and Middle Initial)
              </td>
              <td rowSpan="2" className="col-25">
                SNAP, TANF, or FDPIR case number, or Client ID number for
                children only. All the above, or SSI or Medicaid case number for
                Adults. <strong>Note:</strong> Do not use EBT numbers. Write
                case number and proceed to Part III.
              </td>
              <td colSpan="5" className="col-30">
                <strong>
                  Children in Head Start, foster care and children who meet the
                  definition of migrant, runaway, or homeless are eligible for
                  free meals. Check (✓) all that apply.{" "}
                  <span className="red-text">(See definitions in FAQs)</span>
                </strong>
              </td>
            </tr>
            <tr>
              <td>Head Start</td>
              <td>Foster Child</td>
              <td>Migrant</td>
              <td>Runaway</td>
              <td>Homeless</td>
            </tr>
            {/* Child One */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildOne.name"
                  defaultValue={formData.enrolledChildOne.name}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildOne.caseNumber"
                  defaultValue={formData.enrolledChildOne.caseNumber}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.headStart"
                  defaultChecked={formData.enrolledChildOne.headStart}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.fosterChild"
                  defaultChecked={formData.enrolledChildOne.fosterChild}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.migrant"
                  defaultChecked={formData.enrolledChildOne.migrant}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.runaway"
                  defaultChecked={formData.enrolledChildOne.runaway}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.homeless"
                  defaultChecked={formData.enrolledChildOne.homeless}
                />
              </td>
            </tr>
            {/* Child Two */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildTwo.name"
                  defaultValue={formData.enrolledChildTwo.name}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildTwo.caseNumber"
                  defaultValue={formData.enrolledChildTwo.caseNumber}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.headStart"
                  defaultChecked={formData.enrolledChildTwo.headStart}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.fosterChild"
                  defaultChecked={formData.enrolledChildTwo.fosterChild}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.migrant"
                  defaultChecked={formData.enrolledChildTwo.migrant}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.runaway"
                  defaultChecked={formData.enrolledChildTwo.runaway}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.homeless"
                  defaultChecked={formData.enrolledChildTwo.homeless}
                />
              </td>
            </tr>
            {/* Child Three */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildThree.name"
                  defaultValue={formData.enrolledChildThree.name}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildThree.caseNumber"
                  defaultValue={formData.enrolledChildThree.caseNumber}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.headStart"
                  defaultChecked={formData.enrolledChildThree.headStart}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.fosterChild"
                  defaultChecked={formData.enrolledChildThree.fosterChild}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.migrant"
                  defaultChecked={formData.enrolledChildThree.migrant}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.runaway"
                  defaultChecked={formData.enrolledChildThree.runaway}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.homeless"
                  defaultChecked={formData.enrolledChildThree.homeless}
                />
              </td>
            </tr>
            {/* Child Four */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildFour.name"
                  defaultValue={formData.enrolledChildFour.name}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildFour.caseNumber"
                  defaultValue={formData.enrolledChildFour.caseNumber}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.headStart"
                  defaultChecked={formData.enrolledChildFour.headStart}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.fosterChild"
                  defaultChecked={formData.enrolledChildFour.fosterChild}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.migrant"
                  defaultChecked={formData.enrolledChildFour.migrant}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.runaway"
                  defaultChecked={formData.enrolledChildFour.runaway}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.homeless"
                  defaultChecked={formData.enrolledChildFour.homeless}
                />
              </td>
            </tr>
            {/* Child Five */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildFive.name"
                  defaultValue={formData.enrolledChildFive.name}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildFive.caseNumber"
                  defaultValue={formData.enrolledChildFive.caseNumber}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.headStart"
                  defaultChecked={formData.enrolledChildFive.headStart}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.fosterChild"
                  defaultChecked={formData.enrolledChildFive.fosterChild}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.migrant"
                  defaultChecked={formData.enrolledChildFive.migrant}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.runaway"
                  defaultChecked={formData.enrolledChildFive.runaway}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.homeless"
                  defaultChecked={formData.enrolledChildFive.homeless}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={7} className="parts-header">
                PART II: Report income for ALL Household Members (Skip this step
                if participant is categorically eligible as documented in Part
                I.) Are you unsure what income to include here? Flip the page
                and review the charts titled "Sources of Income" for more
                information.
              </td>
            </tr>
            <tr>
              <td colSpan={7}>
                <div className="child-income-field">
                  <p>
                    <strong>
                      A. Child Income<sup>1</sup>
                    </strong>{" "}
                    - Sometimes children in the household earn or receive
                    income. Please indicate the TOTAL income received by child
                    household members listed in PART I here.
                  </p>

                  <div>
                    <label>
                      Child Income/How often? (i.e., weekly, monthly, etc.)
                    </label>
                    <div></div>
                    {"$"}
                    <input
                      type="text"
                      name="childIncome"
                      defaultValue={formData.childIncome}
                    />
                    /
                    {/* <input
                      type="text"
                      name="childIncomeFrequency"
                      defaultValue={formData.childIncomeFrequency}
                      
                    /> */}
                    <select name="frequency" defaultValue={formData.frequency}>
                      <option>Weekly</option>
                      <option>Bi-Weekly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan={7}>
                <strong>
                  B. Other Household Members<sup>1</sup>
                </strong>{" "}
                . List all household members even if they do not receive income.
                Also, list the adult participant if he/she did not meet
                eligibility in Part I. For each Household Member listed, if they
                do receive income, report total gross income (before taxes) for
                each source in whole dollars (no cents) only along the frequency
                i.e., twice a month, weekly, etc. If they do not receive income
                from any source, write '0'. If you enter "0" or leave any field
                blank you are certifying (promising) there is no income to
                report.
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="col-40">
                Name of Other Household Members (First and Last)
              </td>
              <td className="col-15">
                1. Earnings from work before deductions / How often?
              </td>
              <td className="col-15">
                2. Subsidies, child support, alimony / How often?
              </td>
              <td className="col-15">
                3. Social Security, pensions, retirement / How often?
              </td>
              <td className="col-15">4. All other income / How often?</td>
            </tr>

            <tr>
              <td colSpan={3} className="col-40">
                <ol className="household_members_list">
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberOne.name"
                      defaultValue={formData.houseHoldMemberOne.name}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberTwo.name"
                      defaultValue={formData.houseHoldMemberTwo.name}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberThree.name"
                      defaultValue={formData.houseHoldMemberThree.name}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberFour.name"
                      defaultValue={formData.houseHoldMemberFour.name}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberFive.name"
                      defaultValue={formData.houseHoldMemberFive.name}
                    />
                  </li>
                </ol>
              </td>
              <td className="col-15">
                <ul className="ies_custom_form">
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberOne.workEarnings"
                        defaultValue={formData.houseHoldMemberOne.workEarnings}
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberOne.workEarningsFreq"
                        defaultValue={formData.houseHoldMemberOne.workEarningsFreq}
                        
                      /> */}
                      <select
                        name="frequency"
                        defaultValue={formData.frequency}
                      >
                        <option>Weekly</option>
                        <option>Bi-Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberTwo.workEarnings"
                        defaultValue={formData.houseHoldMemberTwo.workEarnings}
                      />
                      /
                      <select
                        name="frequency"
                        defaultValue={formData.frequency}
                      >
                        <option>Weekly</option>
                        <option>Bi-Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberThree.workEarnings"
                        defaultValue={
                          formData.houseHoldMemberThree.workEarnings
                        }
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberThree.workEarningsFreq"
                        defaultValue={formData.houseHoldMemberThree.workEarningsFreq}
                        
                      /> */}
                      <select
                        name="frequency"
                        defaultValue={formData.frequency}
                      >
                        <option>Weekly</option>
                        <option>Bi-Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFour.workEarnings"
                        defaultValue={formData.houseHoldMemberFour.workEarnings}
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberFour.workEarningsFreq"
                        defaultValue={formData.houseHoldMemberFour.workEarningsFreq}
                        
                      /> */}
                      <select
                        name="frequency"
                        defaultValue={formData.frequency}
                      >
                        <option>Weekly</option>
                        <option>Bi-Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFive.workEarnings"
                        defaultValue={formData.houseHoldMemberFive.workEarnings}
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberFive.workEarningsFreq"
                        defaultValue={formData.houseHoldMemberFive.workEarningsFreq}
                        
                      /> */}
                      <select
                        name="frequency"
                        defaultValue={formData.frequency}
                      >
                        <option>Weekly</option>
                        <option>Bi-Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select>
                    </div>
                  </li>
                </ul>
              </td>
              <td className="col-15">
                <ul className="ies_custom_form">
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberOne.subsidies"
                        defaultValue={formData.houseHoldMemberOne.subsidies}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberOne.subsidiesFreq"
                        defaultValue={formData.houseHoldMemberOne.subsidiesFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberTwo.subsidies"
                        defaultValue={formData.houseHoldMemberTwo.subsidies}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberTwo.subsidiesFreq"
                        defaultValue={formData.houseHoldMemberTwo.subsidiesFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberThree.subsidies"
                        defaultValue={formData.houseHoldMemberThree.subsidies}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberThree.subsidiesFreq"
                        defaultValue={formData.houseHoldMemberThree.subsidiesFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFour.subsidies"
                        defaultValue={formData.houseHoldMemberFour.subsidies}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFour.subsidiesFreq"
                        defaultValue={formData.houseHoldMemberFour.subsidiesFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFive.subsidies"
                        defaultValue={formData.houseHoldMemberFive.subsidies}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFive.subsidiesFreq"
                        defaultValue={formData.houseHoldMemberFive.subsidiesFreq}
                        
                      /> */}
                    </div>
                  </li>
                </ul>
              </td>
              <td className="col-15">
                <ul className="ies_custom_form">
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberOne.socialSecurity"
                        defaultValue={
                          formData.houseHoldMemberOne.socialSecurity
                        }
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberOne.socialSecurityFreq"
                        defaultValue={formData.houseHoldMemberOne.socialSecurityFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberTwo.socialSecurity"
                        defaultValue={
                          formData.houseHoldMemberTwo.socialSecurity
                        }
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberTwo.socialSecurityFreq"
                        defaultValue={formData.houseHoldMemberTwo.socialSecurityFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberThree.socialSecurity"
                        defaultValue={
                          formData.houseHoldMemberThree.socialSecurity
                        }
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberThree.socialSecurityFreq"
                        defaultValue={formData.houseHoldMemberThree.socialSecurityFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFour.socialSecurity"
                        defaultValue={
                          formData.houseHoldMemberFour.socialSecurity
                        }
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFour.socialSecurityFreq"
                        defaultValue={formData.houseHoldMemberFour.socialSecurityFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFive.socialSecurity"
                        defaultValue={
                          formData.houseHoldMemberFive.socialSecurity
                        }
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFive.socialSecurityFreq"
                        defaultValue={formData.houseHoldMemberFive.socialSecurityFreq}
                        
                      /> */}
                    </div>
                  </li>
                </ul>
              </td>
              <td className="col-15">
                <ul className="ies_custom_form">
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberOne.otherIncome"
                        defaultValue={formData.houseHoldMemberOne.otherIncome}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberOne.otherIncomeFreq"
                        defaultValue={formData.houseHoldMemberOne.otherIncomeFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberTwo.otherIncome"
                        defaultValue={formData.houseHoldMemberTwo.otherIncome}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberTwo.otherIncomeFreq"
                        defaultValue={formData.houseHoldMemberTwo.otherIncomeFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberThree.otherIncome"
                        defaultValue={formData.houseHoldMemberThree.otherIncome}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberThree.otherIncomeFreq"
                        defaultValue={formData.houseHoldMemberThree.otherIncomeFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFour.otherIncome"
                        defaultValue={formData.houseHoldMemberFour.otherIncome}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFour.otherIncomeFreq"
                        defaultValue={formData.houseHoldMemberFour.otherIncomeFreq}
                        
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFive.otherIncome"
                        defaultValue={formData.houseHoldMemberFive.otherIncome}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFive.otherIncomeFreq"
                        defaultValue={formData.houseHoldMemberFive.otherIncomeFreq}
                        
                      /> */}
                      {/* <select
                        name="frequency"
                        defaultValue={formData.frequency}
                        
                      >
                        <option>Weekly</option>
                        <option>Bi-Weekly</option>
                        <option>Monthly</option>
                        <option>Yearly</option>
                      </select> */}
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
            {/* Total Household Members */}
            <tr>
              <td colSpan={7}>
                C. Total Household Members (Adults and Children) listed in Part
                I and Part II
                <input
                  type="number"
                  className="form_underline"
                  name="totalHouseholdMembers"
                  defaultValue={formData.totalHouseholdMembers}
                />
              </td>
            </tr>

            {/* SSN Field */}
            <tr>
              <td colSpan={7}>
                <div>
                  <strong>Social Security Number.</strong> If Part II B is
                  completed and household members are listed (with or without
                  income), the adult completing the form must also list the last
                  four digits of his or her Social Security Number or check the
                  "I don't have a Social Security Number" box below. (See
                  Privacy Act Statement on next page).{" "}
                  <span className="red-text">
                    Failure to complete this section, if income is listed, will
                    result in the denial of free or reduced eligibility.
                  </span>
                </div>

                <div className="flex ssn_field">
                  <label>
                    Last four Digits of Social Security Number XXX-XX
                  </label>
                  <input
                    type="text"
                    className="form_underline"
                    name="ssn"
                    defaultValue={formData.ssn}
                  />
                  <input
                    type="checkbox"
                    name="ssnNotAvailable"
                    defaultChecked={formData.ssnNotAvailable}
                  />
                  <label>I do not have a Social Security Number</label>
                </div>
              </td>
            </tr>

            {/* Facility Hours */}
            <tr>
              <td colSpan={7} className="enrollment_hours">
                <div>
                  <span className="header">
                    <strong>PART III: Enrollment Information: </strong>
                  </span>
                  <span className="red-text">
                    <i>Children Only</i>
                  </span>
                </div>

                <div>
                  My child is normally in attendance at the facility between the
                  hours of{" "}
                  <span>
                    <input
                      type="text"
                      className="form_underline"
                      name="facilityStartHours"
                      defaultValue={formData.facilityStartHours}
                    />
                  </span>{" "}
                  [am/pm] to
                  <span>
                    <input
                      type="text"
                      className="form_underline"
                      name="facilityEndHours"
                      defaultValue={formData.facilityEndHours}
                    />
                  </span>{" "}
                  [am/pm].{" "}
                  <span>
                    <input
                      type="checkbox"
                      name="onlyCareProvided"
                      defaultChecked={formData.onlyCareProvided}
                    />
                  </span>
                  Check here if only before/after school care is provided.
                </div>

                <div className="checkbox_spacer">
                  <div className="flex">
                    Check the days your child will normally attend the center:
                    <label>Sunday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Sunday"
                      defaultChecked={formData.centerAttendanceDays.Sunday}
                    />
                    <label>Monday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Monday"
                      defaultChecked={formData.centerAttendanceDays.Monday}
                    />
                    <label>Tuesday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Tuesday"
                      defaultChecked={formData.centerAttendanceDays.Tuesday}
                    />
                    <label>Wednesday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Wednesday"
                      defaultChecked={formData.centerAttendanceDays.Wednesday}
                    />
                    <label>Thursday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Thursday"
                      defaultChecked={formData.centerAttendanceDays.Thursday}
                    />
                    <label>Friday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Friday"
                      defaultChecked={formData.centerAttendanceDays.Friday}
                    />
                    <label>Saturday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Saturday"
                      defaultChecked={formData.centerAttendanceDays.Saturday}
                    />
                  </div>
                  <div className="flex">
                    Check the meals your child will normally receive while in
                    care:
                    <label>Breakfast</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.Breakfast"
                      defaultChecked={formData.mealsReceived.Breakfast}
                    />
                    <label>AM Snack</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.amSnack"
                      defaultChecked={formData.mealsReceived.amSnack}
                    />
                    <label>Lunch</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.Lunch"
                      defaultChecked={formData.mealsReceived.Lunch}
                    />
                    <label>PM Snack</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.pmSnack"
                      defaultChecked={formData.mealsReceived.pmSnack}
                    />
                    <label>Supper</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.Supper"
                      defaultChecked={formData.mealsReceived.Supper}
                    />
                    <label>Evening Snack</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.EveningSnack"
                      defaultChecked={formData.mealsReceived.EveningSnack}
                    />
                  </div>
                </div>
              </td>
            </tr>

            {/* Signature Information */}
            <tr>
              <td colSpan={7} className="enrollment_info">
                <div>
                  <span className="second_header_type">
                    <strong>PART IV: Signature: </strong>
                  </span>
                </div>

                <div>
                  <i>
                    I certify that all information on this form is true and that
                    all income is reported. I understand that the center or day
                    care home will get Federal funds based on the information I
                    give. I understand that CACFP officials may verify the
                    information. I understand that if I purposefully give false
                    information, the participant receiving meals may lose the
                    meal benefits, and I may be prosecuted. This signature also
                    acknowledges that the child(ren) or adult listed on the form
                    in Part I are enrolled for care.{" "}
                    <span className="red-text">
                      If not completed fully and signed, the participant will be
                      placed in the Paid category.
                    </span>
                  </i>
                </div>

                <div>
                  <div className="flex align_center">
                    <label>Signature: X</label>
                    <img src={formData.signature} height={50} />
                  </div>
                  <label>Print Name:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="printName"
                    defaultValue={formData.printName}
                  />

                  <label>Date:</label>
                  <input
                    type="date"
                    className="form_underline"
                    name="date"
                    defaultValue={formData.date}
                  />

                  <label>Address:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="address"
                    defaultValue={formData.address}
                  />

                  <label>City:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="city"
                    defaultValue={formData.city}
                  />

                  <label>State:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="state"
                    defaultValue={formData.state}
                  />

                  <label>Zip:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="zip"
                    defaultValue={formData.zip}
                  />

                  <label>Phone:</label>
                  <input
                    type="tel"
                    className="form_underline"
                    name="phone"
                    defaultValue={formData.phone}
                  />
                </div>
              </td>
            </tr>

            {/* Ethnicity and Race */}
            <tr className="ethnicity">
              <td colSpan={1}>
                <div>Check (✓) one ethnic identity:</div>
                <div>
                  <input
                    type="checkbox"
                    name="ethnicity.hispanic"
                    defaultChecked={formData.ethnicity.hispanic}
                  />
                  <label>Hispanic/ Latino </label>
                  <input
                    type="checkbox"
                    name="ethnicity.nonHispanic"
                    defaultChecked={formData.ethnicity.nonHispanic}
                  />
                  <label>Not Hispanic/ Latino </label>
                </div>
              </td>
              <td colSpan={6}>
                <div>Check (✓) one or more racial identities:</div>
                <div>
                  <input
                    type="checkbox"
                    name="race.americanIndian"
                    defaultChecked={formData.race.americanIndian}
                  />
                  <label>American Indian or Alaskan Native</label>
                  <input
                    type="checkbox"
                    name="race.asian"
                    defaultChecked={formData.race.asian}
                  />
                  <label>Asian</label>
                  <input
                    type="checkbox"
                    name="race.black"
                    defaultChecked={formData.race.black}
                  />
                  <label>Black or African American</label>
                  <input
                    type="checkbox"
                    name="race.hawaiian"
                    defaultChecked={formData.race.hawaiian}
                  />
                  <label>Hawaiian or other Pacific Islander</label>
                  <input
                    type="checkbox"
                    name="race.white"
                    defaultChecked={formData.race.white}
                  />
                  <label>White</label>
                  <input
                    type="checkbox"
                    name="race.multiracial"
                    defaultChecked={formData.race.multiracial}
                  />
                  <label>Multiracial</label>
                </div>
              </td>
            </tr>
            {/* </fieldset> */}

            <tr className="official_sign">
              <td colSpan={7}>
                <p>
                  <strong>
                    Official Use Only Section for Provider: Annual Income
                    Conversion: Weekly x 52, Every 2 weeks x 26, Twice a month x
                    24, Monthly x 12
                  </strong>
                </p>

                <div>
                  <label>Total Income:</label>
                  <input type="text" className="form_underline" />

                  <label>
                    <strong>Per:</strong>
                  </label>

                  <input type="checkbox" />
                  <label>Week</label>

                  <input type="checkbox" />
                  <label>Every Two Weeks</label>

                  <input type="checkbox" />
                  <label>Twice a month</label>

                  <input type="checkbox" />
                  <label>Monthly</label>

                  <input type="checkbox" />
                  <label>Year</label>

                  <label>Household Size Income:</label>
                  <input type="text" className="form_underline" />
                </div>

                <div className="flex">
                  <div className="eligibity_margin">
                    <label>
                      <strong>Categorical Eligibity:</strong>
                      check if applicable (✓)
                    </label>
                    <input type="checkbox" />
                  </div>

                  <div>
                    <label>
                      <strong>Eligibity:</strong>
                      check(✓) one
                    </label>
                    <label>Free</label>
                    <input type="checkbox" />
                    <label>Reduced</label>
                    <input type="checkbox" />
                    <label>Paid</label>
                    <input type="checkbox" />
                  </div>
                </div>

                <div>
                  <p>
                    When more than one person is performing CACFP duties, there
                    must be at least two signatures on this form: one signature
                    from the Determining Official (the official who determined
                    initial income classification) and one signature from the
                    Confirming Official (the official who verified the form’s
                    accuracy).
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
