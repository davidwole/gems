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
  const [touchedFields, setTouchedFields] = useState({});
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

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

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    // Check if password is at least 8 characters
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    // Check if password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    // Check if password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    // Check if password contains at least one number
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    // Check if password contains at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }

    return "";
  };

  // Validate input as user types - but not email (that's handled on blur)
  const validateField = (name, value) => {
    let error = "";

    // Check for empty or whitespace-only content
    if (value.trim() === "") {
      error = "Field cannot be empty or contain only spaces";
    }
    // Check if the string starts with a space
    else if (value.startsWith(" ")) {
      error = "Field cannot start with a space";
    }
    // Skip email validation during typing (will happen on blur)
    else if (name === "password") {
      error = validatePassword(value);
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  // Handle blur event for email validation
  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });

    // Only validate email on blur
    if (name === "email") {
      let error = "";

      if (value.trim() === "") {
        error = "Field cannot be empty or contain only spaces";
      } else if (value.startsWith(" ")) {
        error = "Field cannot start with a space";
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email address";
      }

      setFormErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // Handle password field focus state
    if (name === "password") {
      setPasswordFocused(false);
    }
  };

  const handleFocus = (e) => {
    const { name } = e.target;

    // Set password focus state
    if (name === "password") {
      setPasswordFocused(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Skip email validation during typing (will happen on blur)
    if (name !== "email") {
      validateField(name, value);
    } else {
      // Clear previous email errors during typing
      // We'll validate properly on blur
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create validation configuration
    const validationConfig = {
      requiredFields: ["name", "email", "role", "password"],
      customValidators: {
        email: (value) => {
          if (!validateEmail(value)) {
            return "Please enter a valid email address";
          }
          return "";
        },
        password: (value) => {
          return validatePassword(value);
        },
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

    // Mark all fields as touched when submitting
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage(""); // Clear any previous success message

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
      // Show success message
      setSuccessMessage(`User ${formData.name} created successfully!`);

      // Wait 2 seconds before closing the modal or calling onSuccess
      setTimeout(() => {
        onSuccess && onSuccess(data);
        onClose && onClose();
      }, 3000);
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
      requiredFields: ["name", "email", "role", "password"],
      customValidators: {
        email: (value) => {
          if (!validateEmail(value)) {
            return "Please enter a valid email address";
          }
          return "";
        },
        password: (value) => {
          return validatePassword(value);
        },
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
    <>
      <div className="form-container">
        <h2 className="form-title">Create New User</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message ">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              onBlur={handleBlur}
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
              onBlur={handleBlur}
              required
              className={formErrors.email ? "input-error" : ""}
            />
            {touchedFields.email && formErrors.email && (
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
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              className={formErrors.password ? "input-error" : ""}
            />
            {formErrors.password && (
              <div className="error-text">{formErrors.password}</div>
            )}
            {/* Password requirements hint */}
            <div
              className={`password-hint ${
                passwordFocused || formData.password ? "visible" : ""
              }`}
            >
              <div className="hint-icon">i</div>
              <div className="hint-text">
                Password must contain:
                <ul>
                  <li className={formData.password.length >= 8 ? "valid" : ""}>
                    At least 8 characters
                  </li>
                  <li
                    className={/[A-Z]/.test(formData.password) ? "valid" : ""}
                  >
                    One uppercase letter
                  </li>
                  <li
                    className={/[a-z]/.test(formData.password) ? "valid" : ""}
                  >
                    One lowercase letter
                  </li>
                  <li
                    className={/[0-9]/.test(formData.password) ? "valid" : ""}
                  >
                    One number
                  </li>
                  <li
                    className={
                      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                        formData.password
                      )
                        ? "valid"
                        : ""
                    }
                  >
                    One special character
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleBlur}
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
                  onBlur={handleBlur}
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

        {/* CSS for the password hint and additional styles */}
        <style jsx>{`
          /* Additional styles */
          .form-title {
            margin-bottom: 0px;
            color: #2c3e50;
            font-size: 1.5rem;
          }

          .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 12px;
            margin-bottom: 20px;
            border-left: 4px solid #28a745;
            border-radius: 3px;
            animation: fadeIn 0.5s;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .password-hint {
            display: flex;
            margin-top: 6px;
            background-color: #f8f9fa;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 0.85rem;
            color: #4a5568;
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .password-hint.visible {
            opacity: 1;
            max-height: 200px;
            margin-top: 8px;
          }

          .hint-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: #3182ce;
            color: white;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
            flex-shrink: 0;
          }

          .hint-text {
            flex: 1;
          }

          .hint-text ul {
            margin: 6px 0 0 0;
            padding-left: 18px;
          }

          .hint-text li {
            margin-bottom: 3px;
            position: relative;
            list-style-type: none;
          }

          .hint-text li:before {
            content: "○";
            position: absolute;
            left: -18px;
            color: #a0aec0;
          }

          .hint-text li.valid:before {
            content: "✓";
            color: #38a169;
          }
        `}</style>
      </div>
    </>
  );
};

export default CreateUser;
