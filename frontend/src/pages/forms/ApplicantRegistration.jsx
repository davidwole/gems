import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api";
import "../../styles/applicantRegistration.css";

const ApplicantRegistration = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [formData, setState] = useState({
    email: "",
    name: "",
    position: "",
    password: "",
    confirmPassword: "",
  });
  const [branchName, setBranchName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch branch info to display the specific branch name
  useEffect(() => {
    const fetchBranchInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/branches/${branchId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch branch information");
        }
        const data = await response.json();
        setBranchName(data.name);
      } catch (error) {
        console.error("Error fetching branch:", error);
        setErrors((prev) => ({
          ...prev,
          general: "Branch information not found. Please try again.",
        }));
      }
    };

    if (branchId) {
      fetchBranchInfo();
    }
  }, [branchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear the specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    setState({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Check for empty fields
    if (!formData.name.trim()) {
      newErrors.name = "Full name cannot be empty";
    } else if (formData.name.startsWith(" ")) {
      newErrors.name = "Full name cannot start with a space";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (formData.email.startsWith(" ")) {
      newErrors.email = "Email cannot start with a space";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position cannot be empty";
    } else if (formData.position.startsWith(" ")) {
      newErrors.position = "Position cannot start with a space";
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register-applicant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.name.trim(),
          position: formData.position.trim(),
          password: formData.password,
          branch: branchId,
          role: "L6", // Hardcoded role for applicants
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.msg || "Registration failed. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      // Store token and navigate to dashboard instead of showing I9Form
      localStorage.setItem("token", data.token);
      window.location.assign("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setErrors({ general: "Network error occurred. Please try again later." });
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Apply to {branchName || "our Company"}</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Position Applying For</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Enter the position you're applying for"
            required
          />
          {errors.position && (
            <div className="field-error">{errors.position}</div>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
          {errors.confirmPassword && (
            <div className="field-error">{errors.confirmPassword}</div>
          )}
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Application"}
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
    </div>
  );
};

export default ApplicantRegistration;
