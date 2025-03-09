import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getBranchById } from "../services/api";
import BranchUsers from "../components/BranchUsers";
import HandbookManager from "../components/HandbookManager"; // Import the new component
import "../styles/branchPage.css";
import ApplicantList from "../components/ApplicantList";
import EnrollmentList from "../components/EnrollmentList";
import Reviews from "../components/Reviews";

const BranchPage = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrollments");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBranchData = async () => {
      setLoading(true);
      try {
        const branchData = await getBranchById(id, token);
        setBranch(branchData);
      } catch (error) {
        console.error("Error fetching branch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [id, token, navigate]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="branch-page loading-container">
        <div className="loading-message">Loading branch data...</div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="branch-page error-container">
        <div className="error-message">Branch not found</div>
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="branch-page">
      <header className="branch-header">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="branch-title">
          <h1>{branch.name}</h1>
          <p className="branch-location">{branch.location}</p>
        </div>
      </header>

      <div className="tab-navigation">
        <button
          className={`tab-button ${
            activeTab === "enrollments" ? "active" : ""
          }`}
          onClick={() => setActiveTab("enrollments")}
        >
          Enrollments
        </button>

        <button
          className={`tab-button ${activeTab === "applicants" ? "active" : ""}`}
          onClick={() => setActiveTab("applicants")}
        >
          Job Applicants
        </button>

        <button
          className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
        <button
          className={`tab-button ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`tab-button ${
            activeTab === "employee-handbook" ? "active" : ""
          }`}
          onClick={() => setActiveTab("employee-handbook")}
        >
          Employee Handbook
        </button>
        <button
          className={`tab-button ${
            activeTab === "parent-handbook" ? "active" : ""
          }`}
          onClick={() => setActiveTab("parent-handbook")}
        >
          Parent Handbook
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "enrollments" && (
          <div className="applicants-section">
            <div className="section-header">
              <h2>Enrollments</h2>
            </div>
            <EnrollmentList branchId={id} />
          </div>
        )}

        {activeTab === "applicants" && (
          <div className="applicants-section">
            <div className="section-header">
              <h2>Job Applicants</h2>
            </div>
            <ApplicantList branchId={id} />
          </div>
        )}

        {activeTab === "users" && <BranchUsers />}

        {activeTab === "employee-handbook" && (
          <HandbookManager branchId={id} type="employee" />
        )}

        {activeTab === "parent-handbook" && (
          <HandbookManager branchId={id} type="parent" />
        )}

        {activeTab === "reviews" && (
          <div className="reviews-section">
            <div className="section-header">
              <h2>Branch Reviews</h2>
              <button className="action-button">Post New Review</button>
            </div>
            <div className="content-placeholder">
              <Reviews />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchPage;
