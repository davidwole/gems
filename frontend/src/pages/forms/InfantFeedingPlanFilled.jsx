import { useState, useContext, useEffect } from "react";
import "../../styles/feedingplan2.css";
import { AuthContext } from "../../context/AuthContext";
import Signature from "../../components/Signature";
import { API_URL } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import SignaturePadView from "../../components/SignaturePadView";

export default function InfantFeedingPlanFilled() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();

  // Create state for all form elements
  const [formAnswers, setFormAnswers] = useState({
    user: "",
    // Basic info
    childFullName: "",
    date: "",
    dateOfBirth: "",

    // Yes/No questions (radio-like behavior)
    takeBottle: null,
    bottleWarmed: null,
    holdOwnBottle: null,
    canFeedSelf: null,
    takePacifier: null,
    discussedSolidFoods: null,
    holdHeadSteady: null,
    opensInAnticipation: null,
    closesLipsAroundSpoon: null,
    transfersFood: null,

    // "Does the child eat" checkboxes
    eatStrainedFoods: false,
    eatWholeMilk: false,
    eatBabyFood: false,
    eatTableFood: false,
    eatFormula: false,
    eatOther: false,

    // Text inputs
    formulaType: "",
    formulaAmountAndTime: "",
    formulaDate: "",
    pacifierWhen: "",
    parentInitials: "",
    solidFoodInstructions: "",
    foodLikes: "",
    foodDislikes: "",
    allergies: "",
    updatedInstructions: "",
    parentSignatureDate: "",

    // Table data
    formulaUpdates: [
      { date: "", time: "", amount: "", type: "" },
      { date: "", time: "", amount: "", type: "" },
      { date: "", time: "", amount: "", type: "" },
      { date: "", time: "", amount: "", type: "" },
    ],
    foodUpdates: [
      { date: "", time: "", amount: "" },
      { date: "", time: "", amount: "" },
      { date: "", time: "", amount: "" },
      { date: "", time: "", amount: "" },
    ],

    signature: "",
  });

  // Handler for radio-like behavior (Yes/No questions)
  const handleRadioChange = (question, value) => {
    setFormAnswers({
      ...formAnswers,
      [question]: value,
    });
  };

  // Handler for checkbox changes
  const handleCheckboxChange = (field) => {
    setFormAnswers({
      ...formAnswers,
      [field]: !formAnswers[field],
    });
  };

  // Handler for text input changes
  const handleInputChange = (field, value) => {
    setFormAnswers({
      ...formAnswers,
      [field]: value,
    });
  };

  // Handler for table updates
  const handleTableChange = (tableType, index, field, value) => {
    const updatedTable = [...formAnswers[tableType]];
    updatedTable[index] = {
      ...updatedTable[index],
      [field]: value,
    };
    setFormAnswers({
      ...formAnswers,
      [tableType]: updatedTable,
    });
  };

  // Handler for signature
  const handleSignature = (dataUrl) => {
    setFormAnswers({
      ...formAnswers,
      signature: dataUrl,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createInfantFeedingPlan(formAnswers);
      if (response.success) {
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getForm = async () => {
    const response = await fetch(`${API_URL}/infant-feeding-plans/${userId}`);
    const json = await response.json();

    setFormAnswers(json.data[0]);
  };

  useEffect(() => {
    if (user) {
      setFormAnswers({
        ...formAnswers,
        user: user.id,
      });
    }
  }, [user]);

  useEffect(() => {}, []);

  useEffect(() => {
    getForm();
  }, []);

  if (!formAnswers) {
    return <div>Form not sumbitted yet!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <div className="feeding_plan_container">
          <h3 className="feeding_header">INFANT FEEDING PLAN</h3>
          <div>
            <label>Child's Full Name</label>
            <input
              type="text"
              value={formAnswers.childFullName}
              onChange={(e) =>
                handleInputChange("childFullName", e.target.value)
              }
            />
            <label>Date</label>
            <input
              type="date"
              value={formAnswers.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>

          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              value={formAnswers.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="question">Does the child take a bottle?</label>
            <div className="answers">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.takeBottle === true}
                  onChange={() => handleRadioChange("takeBottle", true)}
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.takeBottle === false}
                  onChange={() => handleRadioChange("takeBottle", false)}
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="question">Is the bottle warmed?</label>
            <div className="answers">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.bottleWarmed === true}
                  onChange={() => handleRadioChange("bottleWarmed", true)}
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.bottleWarmed === false}
                  onChange={() => handleRadioChange("bottleWarmed", false)}
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="question">Does the child hold own bottle?</label>
            <div className="answers">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.holdOwnBottle === true}
                  onChange={() => handleRadioChange("holdOwnBottle", true)}
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.holdOwnBottle === false}
                  onChange={() => handleRadioChange("holdOwnBottle", false)}
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="question">Can the child feed self?</label>
            <div className="answers">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.canFeedSelf === true}
                  onChange={() => handleRadioChange("canFeedSelf", true)}
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.canFeedSelf === false}
                  onChange={() => handleRadioChange("canFeedSelf", false)}
                />
              </label>
            </div>
          </div>

          <div>
            <p>Does the child eat: (check all that apply)</p>
          </div>

          <div className="checkbox-row">
            <div className="checkbox-item">
              <label>
                Strained Foods{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.eatStrainedFoods}
                  onChange={() => handleCheckboxChange("eatStrainedFoods")}
                />
              </label>
            </div>
            <div className="checkbox-item">
              <label>
                Whole Milk{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.eatWholeMilk}
                  onChange={() => handleCheckboxChange("eatWholeMilk")}
                />
              </label>
            </div>
          </div>

          <div className="checkbox-row">
            <div className="checkbox-item">
              <label>
                Baby Food{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.eatBabyFood}
                  onChange={() => handleCheckboxChange("eatBabyFood")}
                />
              </label>
            </div>
            <div className="checkbox-item">
              <label>
                Table Food{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.eatTableFood}
                  onChange={() => handleCheckboxChange("eatTableFood")}
                />
              </label>
            </div>
          </div>

          <div className="checkbox-row">
            <div className="checkbox-item">
              <label>
                Formula{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.eatFormula}
                  onChange={() => handleCheckboxChange("eatFormula")}
                />
              </label>
            </div>
            <div className="checkbox-item">
              <label>
                Other{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.eatOther}
                  onChange={() => handleCheckboxChange("eatOther")}
                />
              </label>
            </div>
          </div>

          <div>
            <label>What type formula used, if applicable?</label>
            <input
              type="text"
              value={formAnswers.formulaType}
              onChange={(e) => handleInputChange("formulaType", e.target.value)}
            />
          </div>

          <div className="mg_blk">
            <label>Amount and time of formula/breast milk to be given?</label>
            <input
              type="text"
              value={formAnswers.formulaAmountAndTime}
              onChange={(e) =>
                handleInputChange("formulaAmountAndTime", e.target.value)
              }
            />
            <label>Date</label>
            <input
              type="date"
              value={formAnswers.formulaDate}
              onChange={(e) => handleInputChange("formulaDate", e.target.value)}
            />
          </div>

          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
            className="feeding_table"
          >
            <tbody>
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  UPDATED AMOUNTS OF FORMULA/BREAST MILK TO BE GIVEN
                </td>
              </tr>

              <tr>
                <td>
                  <label>DATE</label>
                </td>
                <td>
                  <label>TIME</label>
                </td>
                <td>
                  <label>AMOUNT</label>
                </td>
                <td>
                  <label>TYPE</label>
                </td>
              </tr>

              {formAnswers.formulaUpdates.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleTableChange(
                          "formulaUpdates",
                          index,
                          "date",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.time}
                      onChange={(e) =>
                        handleTableChange(
                          "formulaUpdates",
                          index,
                          "time",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.amount}
                      onChange={(e) =>
                        handleTableChange(
                          "formulaUpdates",
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.type}
                      onChange={(e) =>
                        handleTableChange(
                          "formulaUpdates",
                          index,
                          "type",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <label>Does the child take a pacifier? </label>
            <label>Yes</label>
            <input
              type="checkbox"
              checked={formAnswers.takePacifier === true}
              onChange={() => handleRadioChange("takePacifier", true)}
            />
            <label>No</label>
            <input
              type="checkbox"
              checked={formAnswers.takePacifier === false}
              onChange={() => handleRadioChange("takePacifier", false)}
            />
            <label>If yes, when? </label>
            <input
              type="text"
              value={formAnswers.pacifierWhen}
              onChange={(e) =>
                handleInputChange("pacifierWhen", e.target.value)
              }
            />
          </div>

          <h4 className="solid_foods">INTRODUCTION OF SOLID FOODS</h4>
          <p>
            The introduction of age-appropriate solid foods should preferably
            occur at six months of age, but no sooner than four months. Has the
            parent discussed with the child's primary caregiver that the child
            has met appropriate developmental skills for the introduction of
            solid foods?
          </p>
          <div className="initials">
            <label>Yes</label>
            <input
              type="checkbox"
              checked={formAnswers.discussedSolidFoods === true}
              onChange={() => handleRadioChange("discussedSolidFoods", true)}
            />
            <label>No</label>
            <input
              type="checkbox"
              checked={formAnswers.discussedSolidFoods === false}
              onChange={() => handleRadioChange("discussedSolidFoods", false)}
            />
            <label>Parent Initials:</label>
            <input
              type="text"
              value={formAnswers.parentInitials}
              onChange={(e) =>
                handleInputChange("parentInitials", e.target.value)
              }
            />
          </div>

          <p>The child has reached the following developmental skills:</p>
          <div className="question-row">
            <label className="question-label">
              Can hold his/her head steady?
            </label>
            <div className="yes-no-group">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.holdHeadSteady === true}
                  onChange={() => handleRadioChange("holdHeadSteady", true)}
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.holdHeadSteady === false}
                  onChange={() => handleRadioChange("holdHeadSteady", false)}
                />
              </label>
            </div>
          </div>

          <div className="question-row">
            <label className="question-label">
              Opens mouth/leans forward in anticipation of food offered?
            </label>
            <div className="yes-no-group">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.opensInAnticipation === true}
                  onChange={() =>
                    handleRadioChange("opensInAnticipation", true)
                  }
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.opensInAnticipation === false}
                  onChange={() =>
                    handleRadioChange("opensInAnticipation", false)
                  }
                />
              </label>
            </div>
          </div>

          <div className="question-row">
            <label className="question-label">
              Closes lips around a spoon?
            </label>
            <div className="yes-no-group">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.closesLipsAroundSpoon === true}
                  onChange={() =>
                    handleRadioChange("closesLipsAroundSpoon", true)
                  }
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.closesLipsAroundSpoon === false}
                  onChange={() =>
                    handleRadioChange("closesLipsAroundSpoon", false)
                  }
                />
              </label>
            </div>
          </div>

          <div className="question-row">
            <label className="question-label">
              Transfers food from front of the tongue to the back and swallows?
            </label>
            <div className="yes-no-group">
              <label>
                Yes{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.transfersFood === true}
                  onChange={() => handleRadioChange("transfersFood", true)}
                />
              </label>
              <label>
                No{" "}
                <input
                  type="checkbox"
                  checked={formAnswers.transfersFood === false}
                  onChange={() => handleRadioChange("transfersFood", false)}
                />
              </label>
            </div>
          </div>

          <div>
            <label>Instructions for the introduction of solid foods</label>
            <input
              type="text"
              value={formAnswers.solidFoodInstructions}
              onChange={(e) =>
                handleInputChange("solidFoodInstructions", e.target.value)
              }
            />
          </div>

          <div>
            <label>Food likes </label>
            <input
              type="text"
              value={formAnswers.foodLikes}
              onChange={(e) => handleInputChange("foodLikes", e.target.value)}
            />
          </div>

          <div>
            <label>Food dislikes</label>
            <input
              type="text"
              value={formAnswers.foodDislikes}
              onChange={(e) =>
                handleInputChange("foodDislikes", e.target.value)
              }
            />
          </div>

          <div className="mg_blk">
            <label>Allergies? (including any premixed formula)</label>
            <input
              type="text"
              value={formAnswers.allergies}
              onChange={(e) => handleInputChange("allergies", e.target.value)}
            />
          </div>

          <table
            border="1"
            style={{ borderCollapse: "collapse", width: "100%" }}
            className="feeding_table"
          >
            <tbody>
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  UPDATED AMOUNTS/TYPE OF FOOD TO BE GIVEN
                </td>
              </tr>

              <tr>
                <td>
                  <label>DATE</label>
                </td>
                <td>
                  <label>TIME</label>
                </td>
                <td>
                  <label>AMOUNT</label>
                </td>
              </tr>

              {formAnswers.foodUpdates.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleTableChange(
                          "foodUpdates",
                          index,
                          "date",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.time}
                      onChange={(e) =>
                        handleTableChange(
                          "foodUpdates",
                          index,
                          "time",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.amount}
                      onChange={(e) =>
                        handleTableChange(
                          "foodUpdates",
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mg_blk">
            <label>
              Any updated instructions regarding adding new foods or other
              dietary changes, please list as needed
            </label>
            <input
              type="text"
              value={formAnswers.updatedInstructions}
              onChange={(e) =>
                handleInputChange("updatedInstructions", e.target.value)
              }
            />
          </div>

          <div>
            <label>PARENT'S SIGNATURE:</label>
            <SignaturePadView signature={formAnswers.signature} />
            <label>Date</label>
            <input
              type="date"
              value={formAnswers.parentSignatureDate}
              onChange={(e) =>
                handleInputChange("parentSignatureDate", e.target.value)
              }
            />
          </div>
        </div>
      </fieldset>
    </form>
  );
}
