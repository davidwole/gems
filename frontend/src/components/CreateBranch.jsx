import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/forms.css";
import { API_URL } from "../services/api";
import { useFormValidation } from "../utils/formValidation";

const CreateBranch = ({ onClose, onSuccess }) => {
  const { token } = useContext(AuthContext);
  const [error, setError] = useState("");

  const initialValues = {
    name: "",
    location: "",
  };

  const [
    formData,
    setFormData,
    {
      handleChange,
      formErrors,
      isFormValid,
      validateAllFields,
      isSubmitting,
      setIsSubmitting,
    },
  ] = useFormValidation(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/branches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to create branch");
      }

      setIsSubmitting(false);
      onSuccess && onSuccess(data);
      onClose && onClose();
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create New Branch</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Branch Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={formErrors.name ? "input-error" : ""}
          />
          {formErrors.name && (
            <div className="error-text">{formErrors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={formErrors.location ? "input-error" : ""}
          />
          {formErrors.location && (
            <div className="error-text">{formErrors.location}</div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? "Creating..." : "Create Branch"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBranch;
