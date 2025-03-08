import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/forms.css";
import { API_URL } from "../services/api";
import { validateForm } from "../utils/formValidation";

const CreateUser = ({ onClose, onSuccess }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "L1", // Default set to L1
    branch: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [fetchingBranches, setFetchingBranches] = useState(true);

  // Role descriptions for better clarity
  const roleDescriptions = {
    L1: "Super User - Full system access",
    L2: "Data Admin - Cross-branch data access",
    L3: "Branch Director - Branch management",
    L4: "Assistant Director - Enrollment management",
    L5: "Employee - Regular staff access",
    L6: "Prospective Employee - Limited hiring access",
    L7: "Parent - Child management access",
    L8: "Prospective Parent - Enrollment process",
    L10: "General Public - Basic access",
  };

  // Roles that don't require branch assignment
  const globalRoles = ["L1", "L2"];

  // Fetch all branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      setFetchingBranches(true);
      try {
        const response = await fetch(`${API_URL}/branches`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || "Failed to fetch branches");
        }

        setBranches(data);
      } catch (err) {
        setError("Failed to load branches: " + err.message);
      } finally {
        setFetchingBranches(false);
      }
    };

    fetchBranches();
  }, [token]);

  // Handle role change - remove or add branch based on role
  useEffect(() => {
    if (globalRoles.includes(formData.role)) {
      // Remove branch for global roles
      const { branch, ...rest } = formData;
      setFormData(rest);
    } else if (!("branch" in formData)) {
      // Add branch field for branch-specific roles
      setFormData({ ...formData, branch: "" });
    }
  }, [formData.role]);

  // Validate input as user types
  const validateField = (name, value) => {
    let error = "";

    // Skip validation for password field
    if (name !== "password") {
      // Check for empty or whitespace-only content
      if (value.trim() === "") {
        error = "Field cannot be empty or contain only spaces";
      }
      // Check if the string starts with a space
      else if (value.startsWith(" ")) {
        error = "Field cannot start with a space";
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate the field
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create validation configuration
    const validationConfig = {
      skipFields: ["password"],
      requiredFields: ["name", "email", "role"],
      customValidators: {
        branch: (value) => {
          if (!globalRoles.includes(formData.role) && !value) {
            return "Branch is required for this role";
          }
          return "";
        },
      },
    };

    // Validate all fields using our utility
    const errors = validateForm(formData, validationConfig);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare the data to send
      const dataToSend = { ...formData };

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to create user");
      }

      setLoading(false);
      onSuccess && onSuccess(data);
      onClose && onClose();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Check if form can be submitted
  const isFormValid = () => {
    // If there are any form errors, the form is invalid
    if (Object.values(formErrors).some((error) => error !== "")) {
      return false;
    }

    // Create validation configuration
    const validationConfig = {
      skipFields: ["password"],
      requiredFields: ["name", "email", "role"],
      customValidators: {
        branch: (value) => {
          if (!globalRoles.includes(formData.role) && !value) {
            return "Branch is required for this role";
          }
          return "";
        },
      },
    };

    // Check all fields using our utility
    const errors = validateForm(formData, validationConfig);

    // Additionally check that password is not empty
    if (formData.password === "") {
      return false;
    }

    return Object.keys(errors).length === 0;
  };

  // Need to disable form for branch-specific roles when no branches exist
  const shouldDisableSubmit = () => {
    if (loading) return true;
    if (!isFormValid()) return true;

    // Disable if branch is required but no branches exist
    if (!globalRoles.includes(formData.role) && branches.length === 0) {
      return true;
    }

    return false;
  };

  return (
    <div className="form-container">
      <h2>Create New User</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            className={formErrors.name ? "input-error" : ""}
          />
          {formErrors.name && (
            <div className="error-text">{formErrors.name}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
            className={formErrors.email ? "input-error" : ""}
          />
          {formErrors.email && (
            <div className="error-text">{formErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            required
            className={formErrors.password ? "input-error" : ""}
          />
          {formErrors.password && (
            <div className="error-text">{formErrors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            {Object.entries(roleDescriptions).map(([role, description]) => (
              <option key={role} value={role}>
                {role} - {description}
              </option>
            ))}
          </select>
        </div>

        {/* Show branch selection only for branch-specific roles */}
        {!globalRoles.includes(formData.role) && (
          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            {fetchingBranches ? (
              <div>Loading branches...</div>
            ) : branches.length === 0 ? (
              <div className="warning-message">
                No branches available. Please create a branch first.
              </div>
            ) : (
              <select
                id="branch"
                name="branch"
                value={formData.branch || ""}
                onChange={handleChange}
                required
                className={formErrors.branch ? "input-error" : ""}
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.location}
                  </option>
                ))}
              </select>
            )}
            {formErrors.branch && (
              <div className="error-text">{formErrors.branch}</div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={shouldDisableSubmit()}
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
