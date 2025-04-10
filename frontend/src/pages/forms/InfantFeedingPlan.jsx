import "../../styles/feedingplan.css";

export default function InfantFeedingPlan() {
  return (
    <div className="feeding_plan_container">
      <h3 className="feeding_header">INFANT FEEDING PLAN</h3>
      <div>
        <label>Child's Full Name</label>
        <input type="text" />
        <label>Date</label>
        <input type="date" />
      </div>

      <div>
        <label>Date of Birth</label>
        <input type="date" />
      </div>

      <div className="form-group">
        <label className="question">Does the child take a bottle?</label>
        <div className="answers">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="question">Is the bottle warmed?</label>
        <div className="answers">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="question">Does the child hold own bottle?</label>
        <div className="answers">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="question">Can the child feed self?</label>
        <div className="answers">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div>
        <p>Does the child eat: (check all that apply)</p>
      </div>

      <div className="checkbox-row">
        <div className="checkbox-item">
          <label>
            Strained Foods <input type="checkbox" />
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            Whole Milk <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="checkbox-row">
        <div className="checkbox-item">
          <label>
            Baby Food <input type="checkbox" />
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            Table Food <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="checkbox-row">
        <div className="checkbox-item">
          <label>
            Formula <input type="checkbox" />
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            Other <input type="checkbox" />
          </label>
        </div>
      </div>

      <div>
        <label>What type formula used, if applicable?</label>
        <input type="text" />
      </div>

      <div>
        <label>Amount and time of formula/breast milk to be given?</label>
        <input type="text" />
        <label>Date</label>
        <input type="date" />
      </div>

      <table
        border="1"
        style={{ borderCollapse: "collapse", width: "100%" }}
        className="feeding_table"
      >
        <tbody>
          {/* First row spanning all 4 columns */}
          <tr>
            <td colSpan="4" style={{ textAlign: "center", fontWeight: "bold" }}>
              UPDATED AMOUNTS OF FORMULA/BREAST MILK TO BE GIVEN
            </td>
          </tr>

          {/* Second and third rows with empty labels */}
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

          {/* Remaining 3 rows with input fields */}
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <label>Does the child take a pacifier? </label>
        <label>Yes</label>
        <input type="checkbox" />
        <label>No</label>
        <input type="checkbox" />
        <label>If yes, when? </label>
        <input type="text" />
      </div>

      <h4 className="solid_foods">INTRODUCTION OF SOLID FOODS</h4>
      <p>
        The introduction of age-appropriate solid foods should preferably occur
        at six months of age, but no sooner than four months. Has the parent
        discussed with the child’s primary caregiver that the child has met
        appropriate developmental skills for the introduction of solid foods?
      </p>
      <div>
        <label>Yes</label>
        <input type="checkbox" />
        <label>No</label>
        <input type="checkbox" />
        <label>Parent Initials:</label>
        <input type="text" />
      </div>

      <p>The child has reached the following developmental skills:</p>
      <div className="question-row">
        <label className="question-label">Can hold his/her head steady?</label>
        <div className="yes-no-group">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="question-row">
        <label className="question-label">
          Opens mouth/leans forward in anticipation of food offered?
        </label>
        <div className="yes-no-group">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="question-row">
        <label className="question-label">Closes lips around a spoon?</label>
        <div className="yes-no-group">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div className="question-row">
        <label className="question-label">
          Transfers food from front of the tongue to the back and swallows?
        </label>
        <div className="yes-no-group">
          <label>
            Yes <input type="checkbox" />
          </label>
          <label>
            No <input type="checkbox" />
          </label>
        </div>
      </div>

      <div>
        <label>Instructions for the introduction of solid foods</label>
        <input type="text" />
      </div>

      <div>
        <label>Food likes </label>
        <input type="text" />
      </div>

      <div>
        <label>Food dislikes</label>
        <input type="text" />
      </div>

      <div>
        <label>Allergies? (including any premixed formula)</label>
        <input type="text" />
      </div>

      <table
        border="1"
        style={{ borderCollapse: "collapse", width: "100%" }}
        className="feeding_table"
      >
        <tbody>
          {/* First row spanning all 4 columns */}
          <tr>
            <td colSpan="4" style={{ textAlign: "center", fontWeight: "bold" }}>
              UPDATED AMOUNTS/TYPE OF FOOD TO BE GIVEN
            </td>
          </tr>

          {/* Second and third rows with empty labels */}
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

          {/* Remaining 3 rows with input fields */}
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input type="text" />
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <label>
          Any updated instructions regarding adding new foods or other dietary
          changes, please list as needed
        </label>

        <input type="text" />
      </div>

      <div>
        <label>PARENT’S SIGNATURE:</label>
        <input type="text" />
        <label>Date</label>
        <input type="date" />
      </div>
    </div>
  );
}
