import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { registerParent, getBranchById } from "../../services/api";
import "../../styles/applicantRegistration.css";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
        name: formData.name,
        email: formData.email,
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
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
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
