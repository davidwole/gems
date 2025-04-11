import { useState, useEffect, useContext } from "react";
import "../../styles/IESForm.css";
import { AuthContext } from "../../context/AuthContext";
import { submitEnrollmentForm } from "../../services/api";
import Signature from "../../components/Signature";

export default function IESForm() {
  const { user } = useContext(AuthContext);

  const [formData, setFormdata] = useState({
    user: user?.id,
    branch: user?.branch,
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

    try {
      const result = await submitEnrollmentForm(formData);
      console.log(result);
    } catch (error) {
      console.error("Submission failed:", error);
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

  return (
    <div className="ies">
      <h3 className="heading">
        CACFP Meal Benefit Income Eligibility Statement
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Form is way to long to represent */}
      </form>
    </div>
  );
}
