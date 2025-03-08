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
  const [error, setError] = useState("");
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
        setError("Branch information not found. Please try again.");
      }
    };

    if (branchId) {
      fetchBranchInfo();
    }
  }, [branchId]);

  const handleChange = (e) => {
    setState({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register-applicant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          position: formData.position,
          password: formData.password,
          branch: branchId,
          role: "L6", // Hardcoded role for applicants
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store token and navigate to dashboard instead of showing I9Form
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
      setIsLoading(false);
    } catch (error) {
      setError("Network error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Apply to {branchName || "our Company"}</h2>
      {error && <div className="error-message">{error}</div>}
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
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplicantRegistration;
