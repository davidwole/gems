import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { registerParent, getBranchById } from "../../services/api";
import "../../styles/applicantRegistration.css";
import "../../styles/forms.css"; // Import the forms.css styles

const ParentRegistration = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [branchName, setBranchName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Fetch branch name for display
  useEffect(() => {
    const fetchBranchName = async () => {
      try {
        const branch = await getBranchById(branchId);
        setBranchName(branch.name);
      } catch (error) {
        console.error("Failed to fetch branch information:", error);
        setBranchName("Unknown Branch");
      }
    };

    if (branchId) {
      fetchBranchName();
    }
  }, [branchId]);

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

  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === "password") {
      setPasswordFocused(true);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name === "password") {
      setPasswordFocused(false);

      // Validate password on blur
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setErrors((prev) => ({
          ...prev,
          password: passwordError,
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    // Validate password as user types
    if (name === "password") {
      const passwordError = validatePassword(value);
      if (passwordError) {
        setErrors((prev) => ({
          ...prev,
          password: passwordError,
        }));
      }
    }

    // Check password match when confirmPassword changes
    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.startsWith(" ")) {
      newErrors.name = "Name cannot start with a space";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    } else if (formData.email.startsWith(" ")) {
      newErrors.email = "Email cannot start with a space";
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call API to register parent
      const response = await registerParent({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        branch: branchId,
        role: "L8", // Parent role
      });

      localStorage.setItem("token", response.token);
      window.location.assign("/dashboard");
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Failed to register. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Parent Registration</h2>
      <div className="branch-info">
        {branchName
          ? `Enrolling at: ${branchName}`
          : "Loading branch information..."}
      </div>

      {submitSuccess ? (
        <div className="success-message">
          <p>
            Registration successful! You will be redirected to the login page.
          </p>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Create a password"
              required
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
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
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className={errors.confirmPassword ? "input-error" : ""}
            />
            {errors.confirmPassword && (
              <div className="error-text">{errors.confirmPassword}</div>
            )}
          </div>

          {submitError && <div className="error-message">{submitError}</div>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register as Parent"}
          </button>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#3498db" }}>
                Login
              </a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default ParentRegistration;
