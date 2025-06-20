import { useState, useEffect, useContext } from "react";
import "../../styles/infantaffidavit.css";
import SignaturePadView from "../../components/SignaturePadView";
import { createInfantAffidavit } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../services/api";

export default function InfantAffidavitFilled() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  // Define state for the form
  const [formData, setFormData] = useState({
    sponsorName: "",
    providerName: "Gems Learning Academy", // Pre-filled value
    infantName: "",
    infantDOB: "",
    parentName: "",
    formulaBrand: "Silmac Advance", // Pre-filled value
    infantCereal: "Gerber Rice, Wheat, and Oatmeal", // Pre-filled value
    infantFood: "Gerber Baby Food", // Pre-filled value
    mealOption: "", // Will store "provider" or "parent"
    parentProvidedComponents: {
      formula: false,
      cereal: false,
      fruit: false,
      vegetable: false,
      protein: false,
      dairy: false,
      bread: false,
    },
    signature: "",
    date: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle meal option selection
  const handleMealOptionChange = (option) => {
    setFormData({
      ...formData,
      mealOption: option,
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      parentProvidedComponents: {
        ...formData.parentProvidedComponents,
        [name]: checked,
      },
    });
  };

  const handleSignature = (dataUrl) => {
    setFormData({
      ...formData,
      signature: dataUrl,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createInfantAffidavit(formData);
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
    const response = await fetch(`${API_URL}/infant-affidavits/${userId}`);
    const json = await response.json();

    setFormData(json[0]);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        user: user.id,
      });
    }
  }, [user]);

  useEffect(() => {}, []);

  useEffect(() => {
    getForm();
  }, []);

  return (
    <div className="infant_affidavit_container">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <h3 className="infant_affidavit_header">Infant Affidavit</h3>

          <div>
            <label htmlFor="sponsorName">Name of Sponsor (if applicable)</label>
            <input
              type="text"
              id="sponsorName"
              name="sponsorName"
              value={formData.sponsorName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="providerName">Name of Provider/Center</label>
            <input
              type="text"
              id="providerName"
              name="providerName"
              value={formData.providerName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="infantName">Name of Infant</label>
            <input
              type="text"
              id="infantName"
              name="infantName"
              value={formData.infantName}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="infantDOB">Infant Date of Birth</label>
            <input
              type="date"
              id="infantDOB"
              name="infantDOB"
              value={formData.infantDOB}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="parentName">Name of Parent/Guardian</label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleInputChange}
            />
          </div>

          <p>
            According to USDA regulations, as an institution participating in
            the Child and Adult Care Food Program must provide meals to all
            infants enrolled for care in the center/facility.
          </p>

          <div>
            <label htmlFor="formulaBrand">
              Center/Provider will provide the following milk-based
              iron-fortified formula:{" "}
            </label>
            <input
              type="text"
              id="formulaBrand"
              name="formulaBrand"
              value={formData.formulaBrand}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="infantCereal">
              Center/Provider will provide the following Iron-fortified infant
              cereal
            </label>
            <input
              type="text"
              id="infantCereal"
              name="infantCereal"
              value={formData.infantCereal}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="infantFood">
              Center/Provider will provide the following brand of infant food
            </label>
            <input
              type="text"
              id="infantFood"
              name="infantFood"
              value={formData.infantFood}
              onChange={handleInputChange}
            />
          </div>

          <div className="divider"></div>

          <p>Parents/Guardians,</p>

          <p>
            Please check one of the following options below and sign this form:
          </p>

          <div>
            <input
              type="radio"
              className="meal_option"
              id="providerOption"
              name="mealOption"
              value="provider"
              checked={formData.mealOption === "provider"}
              onChange={() => handleMealOptionChange("provider")}
            />
            <label htmlFor="providerOption">
              I would like the provider/center to provide ALL meal components to
              my infant and I will provide clean, sanitized, and labeled bottles
              daily.
            </label>
          </div>

          <div>
            <input
              type="radio"
              className="meal_option"
              id="parentOption"
              name="mealOption"
              value="parent"
              checked={formData.mealOption === "parent"}
              onChange={() => handleMealOptionChange("parent")}
            />
            <label htmlFor="parentOption">
              I will provide the following meal component to my infant and the
              center will provide all other meal components:
            </label>
          </div>

          {/* {formData.mealOption === "parent" && ( */}
          <div className="form-container">
            <div className="row">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="formula"
                  name="formula"
                  checked={formData.parentProvidedComponents.formula}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="formula">
                  Formula<sup>*</sup>
                </label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="protein"
                  name="protein"
                  checked={formData.parentProvidedComponents.protein}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="protein">
                  Meat/Fish/Poultry/Eggs/Beans/Peas
                </label>
              </div>
            </div>

            <div className="row">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="cereal"
                  name="cereal"
                  checked={formData.parentProvidedComponents.cereal}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="cereal">Cereal</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="dairy"
                  name="dairy"
                  checked={formData.parentProvidedComponents.dairy}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="dairy">Cheese/Cottage Cheese/Yogurt</label>
              </div>
            </div>

            <div className="row">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="fruit"
                  name="fruit"
                  checked={formData.parentProvidedComponents.fruit}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="fruit">Fruit</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="bread"
                  name="bread"
                  checked={formData.parentProvidedComponents.bread}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="bread">Bread/Crackers/Breakfast Cereal</label>
              </div>
            </div>

            <div className="row">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="vegetable"
                  name="vegetable"
                  checked={formData.parentProvidedComponents.vegetable}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="vegetable">Vegetable</label>
              </div>
            </div>
          </div>
          {/* )} */}

          <div>
            <div>
              <SignaturePadView signature={formData.signature} />
            </div>

            <div>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              <label htmlFor="date">Date</label>
            </div>
          </div>

          <p>
            <sup>*</sup>Any parent requesting any formula other than a USDA
            approved milk-based or soy-based iron-fortified formula be provided
            to their infant or any parent who provides any formula other than
            USDA approved milk-based or soy-based iron-fortified formula for
            their infant must provide a doctor's note indicating the required
            use of the formula. If a parent elects to have the center or day
            care home provider supply meals to their infant, the infant will be
            fed according to its individual feeding plan that is provided by the
            parent or guardian. The center or day care home provider may only
            claim reimbursement for no more than breakfast, lunch or supper, and
            a snack.
          </p>
        </fieldset>
      </form>
    </div>
  );
}
