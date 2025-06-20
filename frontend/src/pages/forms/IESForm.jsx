import { useState, useEffect, useContext } from "react";
import "../../styles/IESForm.css";
import { AuthContext } from "../../context/AuthContext";
import { submitEnrollmentForm, submitIESForm } from "../../services/api";
import Signature from "../../components/Signature";
import { useNavigate } from "react-router-dom";

export default function IESForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormdata] = useState({
    user: "",
    branch: "",
    enrolledChildOne: {
      name: "",
      caseNumber: "",
      headStart: false,
      fosterChild: false,
      migrant: false,
      runaway: false,
      homeless: false,
    },
    enrolledChildTwo: {
      name: "",
      caseNumber: "",
      headStart: false,
      fosterChild: false,
      migrant: false,
      runaway: false,
      homeless: false,
    },
    enrolledChildThree: {
      name: "",
      caseNumber: "",
      headStart: false,
      fosterChild: false,
      migrant: false,
      runaway: false,
      homeless: false,
    },
    enrolledChildFour: {
      name: "",
      caseNumber: "",
      headStart: false,
      fosterChild: false,
      migrant: false,
      runaway: false,
      homeless: false,
    },
    enrolledChildFive: {
      name: "",
      caseNumber: "",
      headStart: false,
      fosterChild: false,
      migrant: false,
      runaway: false,
      homeless: false,
    },
    childIncome: "",
    frequency: "Weekly",
    houseHoldMemberOne: {
      name: "",
      workEarnings: "",
      subsidies: "",
      socialSecurity: "",
      otherIncome: "",
    },
    houseHoldMemberTwo: {
      name: "",
      workEarnings: "",
      subsidies: "",
      socialSecurity: "",
      otherIncome: "",
    },
    houseHoldMemberThree: {
      name: "",
      workEarnings: "",
      subsidies: "",
      socialSecurity: "",
      otherIncome: "",
    },
    houseHoldMemberFour: {
      name: "",
      workEarnings: "",
      subsidies: "",
      socialSecurity: "",
      otherIncome: "",
    },
    houseHoldMemberFive: {
      name: "",
      workEarnings: "",
      subsidies: "",
      subsidiesFreq: "",
      socialSecurity: "",
      otherIncome: "",
    },
    totalHouseholdMemebers: "",
    ssn: "",
    ssnNotAvailable: false,
    facilityStartHours: "",
    facilityEndHours: "",
    OnlyCareProvided: false,
    centerAttendanceDays: {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    },
    mealsReceived: {
      Breakfast: false,
      amSnack: false,
      Lunch: false,
      pmSnack: false,
      Supper: false,
      EveningSnack: false,
    },
    signature: "",
    printName: "",
    date: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    ethnicity: {
      hispanic: false,
      nonHispanic: false,
    },
    race: {
      americanIndian: false,
      asian: false,
      black: false,
      hawaiian: false,
      white: false,
      multiracial: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormdata((prevData) => {
      const keys = name.split(".");
      if (keys.length === 1) {
        return {
          ...prevData,
          [name]: type === "checkbox" ? checked : value,
        };
      } else {
        const [parentKey, childKey] = keys;
        return {
          ...prevData,
          [parentKey]: {
            ...prevData[parentKey],
            [childKey]: type === "checkbox" ? checked : value,
          },
        };
      }
    });
  };

  const handleEthnicityChange = (selected) => {
    setFormdata((prevData) => ({
      ...prevData,
      ethnicity: {
        hispanic: selected === "hispanic",
        nonHispanic: selected === "nonHispanic",
      },
    }));
  };

  const handleRaceChange = (selected) => {
    setFormdata((prevData) => ({
      ...prevData,
      race: {
        americanIndian: selected === "americanIndian",
        asian: selected === "asian",
        black: selected === "black",
        hawaiian: selected === "hawaiian",
        white: selected === "white",
        multiracial: selected === "multiracial",
      },
    }));
  };

  const handleSignatureSave = (dataUrl) => {
    setFormdata((prevState) => ({
      ...prevState,
      signature: dataUrl,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await submitIESForm(formData);
      console.log(result);
      if (result.success) {
        setSubmitSuccess(true);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Form submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFormdata((prevData) => ({
        ...prevData,
        user: user.id,
        branch: user.branch,
      }));
    }
  }, [user]);

  useEffect(() => {});

  // Success message overlay
  if (submitSuccess) {
    return (
      <div className="success-overlay">
        <div className="success-message">
          <h2>Form Submitted Successfully!</h2>
          <p>Thank you for submitting your enrollment form.</p>
          <p>You will be redirected to the dashboard in a moment...</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="success-button"
          >
            Return to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ies">
      <h3 className="heading">
        CACFP Meal Benefit Income Eligibility Statement
      </h3>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
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
                  value={formData.enrolledChildOne.name}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildOne.caseNumber"
                  value={formData.enrolledChildOne.caseNumber}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.headStart"
                  checked={formData.enrolledChildOne.headStart}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.fosterChild"
                  checked={formData.enrolledChildOne.fosterChild}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.migrant"
                  checked={formData.enrolledChildOne.migrant}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.runaway"
                  checked={formData.enrolledChildOne.runaway}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildOne.homeless"
                  checked={formData.enrolledChildOne.homeless}
                  onChange={handleChange}
                />
              </td>
            </tr>
            {/* Child Two */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildTwo.name"
                  value={formData.enrolledChildTwo.name}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildTwo.caseNumber"
                  value={formData.enrolledChildTwo.caseNumber}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.headStart"
                  checked={formData.enrolledChildTwo.headStart}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.fosterChild"
                  checked={formData.enrolledChildTwo.fosterChild}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.migrant"
                  checked={formData.enrolledChildTwo.migrant}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.runaway"
                  checked={formData.enrolledChildTwo.runaway}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildTwo.homeless"
                  checked={formData.enrolledChildTwo.homeless}
                  onChange={handleChange}
                />
              </td>
            </tr>
            {/* Child Three */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildThree.name"
                  value={formData.enrolledChildThree.name}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildThree.caseNumber"
                  value={formData.enrolledChildThree.caseNumber}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.headStart"
                  checked={formData.enrolledChildThree.headStart}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.fosterChild"
                  checked={formData.enrolledChildThree.fosterChild}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.migrant"
                  checked={formData.enrolledChildThree.migrant}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.runaway"
                  checked={formData.enrolledChildThree.runaway}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildThree.homeless"
                  checked={formData.enrolledChildThree.homeless}
                  onChange={handleChange}
                />
              </td>
            </tr>
            {/* Child Four */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildFour.name"
                  value={formData.enrolledChildFour.name}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildFour.caseNumber"
                  value={formData.enrolledChildFour.caseNumber}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.headStart"
                  checked={formData.enrolledChildFour.headStart}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.fosterChild"
                  checked={formData.enrolledChildFour.fosterChild}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.migrant"
                  checked={formData.enrolledChildFour.migrant}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.runaway"
                  checked={formData.enrolledChildFour.runaway}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFour.homeless"
                  checked={formData.enrolledChildFour.homeless}
                  onChange={handleChange}
                />
              </td>
            </tr>
            {/* Child Five */}
            <tr className="part-1-inputs">
              <td>
                <input
                  type="text"
                  name="enrolledChildFive.name"
                  value={formData.enrolledChildFive.name}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="enrolledChildFive.caseNumber"
                  value={formData.enrolledChildFive.caseNumber}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.headStart"
                  checked={formData.enrolledChildFive.headStart}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.fosterChild"
                  checked={formData.enrolledChildFive.fosterChild}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.migrant"
                  checked={formData.enrolledChildFive.migrant}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.runaway"
                  checked={formData.enrolledChildFive.runaway}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="enrolledChildFive.homeless"
                  checked={formData.enrolledChildFive.homeless}
                  onChange={handleChange}
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
                      value={formData.childIncome}
                      onChange={handleChange}
                    />
                    /
                    {/* <input
                      type="text"
                      name="childIncomeFrequency"
                      value={formData.childIncomeFrequency}
                      onChange={handleChange}
                    /> */}
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                    >
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
                      value={formData.houseHoldMemberOne.name}
                      onChange={handleChange}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberTwo.name"
                      value={formData.houseHoldMemberTwo.name}
                      onChange={handleChange}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberThree.name"
                      value={formData.houseHoldMemberThree.name}
                      onChange={handleChange}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberFour.name"
                      value={formData.houseHoldMemberFour.name}
                      onChange={handleChange}
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      name="houseHoldMemberFive.name"
                      value={formData.houseHoldMemberFive.name}
                      onChange={handleChange}
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
                        value={formData.houseHoldMemberOne.workEarnings}
                        onChange={handleChange}
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberOne.workEarningsFreq"
                        value={formData.houseHoldMemberOne.workEarningsFreq}
                        onChange={handleChange}
                      /> */}
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
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
                        value={formData.houseHoldMemberTwo.workEarnings}
                        onChange={handleChange}
                      />
                      /
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
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
                        value={formData.houseHoldMemberThree.workEarnings}
                        onChange={handleChange}
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberThree.workEarningsFreq"
                        value={formData.houseHoldMemberThree.workEarningsFreq}
                        onChange={handleChange}
                      /> */}
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
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
                        value={formData.houseHoldMemberFour.workEarnings}
                        onChange={handleChange}
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberFour.workEarningsFreq"
                        value={formData.houseHoldMemberFour.workEarningsFreq}
                        onChange={handleChange}
                      /> */}
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
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
                        value={formData.houseHoldMemberFive.workEarnings}
                        onChange={handleChange}
                      />
                      /
                      {/* <input
                        type="text"
                        name="houseHoldMemberFive.workEarningsFreq"
                        value={formData.houseHoldMemberFive.workEarningsFreq}
                        onChange={handleChange}
                      /> */}
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
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
                        value={formData.houseHoldMemberOne.subsidies}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberOne.subsidiesFreq"
                        value={formData.houseHoldMemberOne.subsidiesFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberTwo.subsidies"
                        value={formData.houseHoldMemberTwo.subsidies}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberTwo.subsidiesFreq"
                        value={formData.houseHoldMemberTwo.subsidiesFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberThree.subsidies"
                        value={formData.houseHoldMemberThree.subsidies}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberThree.subsidiesFreq"
                        value={formData.houseHoldMemberThree.subsidiesFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFour.subsidies"
                        value={formData.houseHoldMemberFour.subsidies}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFour.subsidiesFreq"
                        value={formData.houseHoldMemberFour.subsidiesFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFive.subsidies"
                        value={formData.houseHoldMemberFive.subsidies}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFive.subsidiesFreq"
                        value={formData.houseHoldMemberFive.subsidiesFreq}
                        onChange={handleChange}
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
                        value={formData.houseHoldMemberOne.socialSecurity}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberOne.socialSecurityFreq"
                        value={formData.houseHoldMemberOne.socialSecurityFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberTwo.socialSecurity"
                        value={formData.houseHoldMemberTwo.socialSecurity}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberTwo.socialSecurityFreq"
                        value={formData.houseHoldMemberTwo.socialSecurityFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberThree.socialSecurity"
                        value={formData.houseHoldMemberThree.socialSecurity}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberThree.socialSecurityFreq"
                        value={formData.houseHoldMemberThree.socialSecurityFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFour.socialSecurity"
                        value={formData.houseHoldMemberFour.socialSecurity}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFour.socialSecurityFreq"
                        value={formData.houseHoldMemberFour.socialSecurityFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFive.socialSecurity"
                        value={formData.houseHoldMemberFive.socialSecurity}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFive.socialSecurityFreq"
                        value={formData.houseHoldMemberFive.socialSecurityFreq}
                        onChange={handleChange}
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
                        value={formData.houseHoldMemberOne.otherIncome}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberOne.otherIncomeFreq"
                        value={formData.houseHoldMemberOne.otherIncomeFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberTwo.otherIncome"
                        value={formData.houseHoldMemberTwo.otherIncome}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberTwo.otherIncomeFreq"
                        value={formData.houseHoldMemberTwo.otherIncomeFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberThree.otherIncome"
                        value={formData.houseHoldMemberThree.otherIncome}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberThree.otherIncomeFreq"
                        value={formData.houseHoldMemberThree.otherIncomeFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFour.otherIncome"
                        value={formData.houseHoldMemberFour.otherIncome}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFour.otherIncomeFreq"
                        value={formData.houseHoldMemberFour.otherIncomeFreq}
                        onChange={handleChange}
                      /> */}
                    </div>
                  </li>
                  <li>
                    <div className="flex">
                      $
                      <input
                        type="text"
                        name="houseHoldMemberFive.otherIncome"
                        value={formData.houseHoldMemberFive.otherIncome}
                        onChange={handleChange}
                      />
                      {/* /
                      <input
                        type="text"
                        name="houseHoldMemberFive.otherIncomeFreq"
                        value={formData.houseHoldMemberFive.otherIncomeFreq}
                        onChange={handleChange}
                      /> */}
                      {/* <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
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
                  value={formData.totalHouseholdMembers}
                  onChange={handleChange}
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
                    value={formData.ssn}
                    onChange={handleChange}
                  />
                  <input
                    type="checkbox"
                    name="ssnNotAvailable"
                    checked={formData.ssnNotAvailable}
                    onChange={handleChange}
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
                      value={formData.facilityStartHours}
                      onChange={handleChange}
                    />
                  </span>{" "}
                  [am/pm] to
                  <span>
                    <input
                      type="text"
                      className="form_underline"
                      name="facilityEndHours"
                      value={formData.facilityEndHours}
                      onChange={handleChange}
                    />
                  </span>{" "}
                  [am/pm].{" "}
                  <span>
                    <input
                      type="checkbox"
                      name="onlyCareProvided"
                      checked={formData.onlyCareProvided}
                      onChange={handleChange}
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
                      checked={formData.centerAttendanceDays.Sunday}
                      onChange={handleChange}
                    />
                    <label>Monday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Monday"
                      checked={formData.centerAttendanceDays.Monday}
                      onChange={handleChange}
                    />
                    <label>Tuesday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Tuesday"
                      checked={formData.centerAttendanceDays.Tuesday}
                      onChange={handleChange}
                    />
                    <label>Wednesday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Wednesday"
                      checked={formData.centerAttendanceDays.Wednesday}
                      onChange={handleChange}
                    />
                    <label>Thursday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Thursday"
                      checked={formData.centerAttendanceDays.Thursday}
                      onChange={handleChange}
                    />
                    <label>Friday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Friday"
                      checked={formData.centerAttendanceDays.Friday}
                      onChange={handleChange}
                    />
                    <label>Saturday</label>
                    <input
                      type="checkbox"
                      name="centerAttendanceDays.Saturday"
                      checked={formData.centerAttendanceDays.Saturday}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex">
                    Check the meals your child will normally receive while in
                    care:
                    <label>Breakfast</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.Breakfast"
                      checked={formData.mealsReceived.Breakfast}
                      onChange={handleChange}
                    />
                    <label>AM Snack</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.amSnack"
                      checked={formData.mealsReceived.amSnack}
                      onChange={handleChange}
                    />
                    <label>Lunch</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.Lunch"
                      checked={formData.mealsReceived.Lunch}
                      onChange={handleChange}
                    />
                    <label>PM Snack</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.pmSnack"
                      checked={formData.mealsReceived.pmSnack}
                      onChange={handleChange}
                    />
                    <label>Supper</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.Supper"
                      checked={formData.mealsReceived.Supper}
                      onChange={handleChange}
                    />
                    <label>Evening Snack</label>
                    <input
                      type="checkbox"
                      name="mealsReceived.EveningSnack"
                      checked={formData.mealsReceived.EveningSnack}
                      onChange={handleChange}
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
                  {/* <label>Signature: X</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="signature"
                    value={formData.signature}
                    onChange={handleChange}
                  /> */}
                  <label>Print Name:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="printName"
                    value={formData.printName}
                    onChange={handleChange}
                  />

                  <label>Date:</label>
                  <input
                    type="date"
                    className="form_underline"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />

                  <label>Address:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />

                  <label>City:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />

                  <label>State:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />

                  <label>Zip:</label>
                  <input
                    type="text"
                    className="form_underline"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />

                  <label>Phone:</label>
                  <input
                    type="tel"
                    className="form_underline"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    checked={formData.ethnicity.hispanic}
                    onChange={() => handleEthnicityChange("hispanic")}
                  />
                  <label>Hispanic/ Latino </label>
                  <input
                    type="checkbox"
                    name="ethnicity.nonHispanic"
                    checked={formData.ethnicity.nonHispanic}
                    onChange={() => handleEthnicityChange("nonHispanic")}
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
                    checked={formData.race.americanIndian}
                    onChange={() => handleRaceChange("americanIndian")}
                  />
                  <label>American Indian or Alaskan Native</label>
                  <input
                    type="checkbox"
                    name="race.asian"
                    checked={formData.race.asian}
                    onChange={() => handleRaceChange("asian")}
                  />
                  <label>Asian</label>
                  <input
                    type="checkbox"
                    name="race.black"
                    checked={formData.race.black}
                    onChange={() => handleRaceChange("black")}
                  />
                  <label>Black or African American</label>
                  <input
                    type="checkbox"
                    name="race.hawaiian"
                    checked={formData.race.hawaiian}
                    onChange={() => handleRaceChange("hawaiian")}
                  />
                  <label>Hawaiian or other Pacific Islander</label>
                  <input
                    type="checkbox"
                    name="race.white"
                    checked={formData.race.white}
                    onChange={() => handleRaceChange("white")}
                  />
                  <label>White</label>
                  <input
                    type="checkbox"
                    name="race.multiracial"
                    checked={formData.race.multiracial}
                    onChange={() => handleRaceChange("multiracial")}
                  />
                  <label>Multiracial</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <label>Signature:</label>
          <Signature onSave={handleSignatureSave} />
        </div>
        {/* <button id="i9_button">Submit</button> */}
        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
