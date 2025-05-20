import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getBranchById } from "../services/api";
import BranchUsers from "../components/BranchUsers";
import HandbookManager from "../components/HandbookManager";
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

  // User level - assuming the user object has a "level" property (L1, L2, L3, L4)
  const userLevel = user?.role || "L4"; // Default to most restricted level if not available

  // Define tab access based on user level
  const getAccessibleTabs = () => {
    switch (userLevel) {
      case "L1":
      case "L2":
        return [
          "enrollments",
          "applicants",
          // "reviews",
          "users",
          "employee-handbook",
          "parent-handbook",
        ];
      case "L3":
        return ["enrollments", "applicants"];
      case "L4":
      default:
        return ["enrollments"];
    }
  };

  const accessibleTabs = getAccessibleTabs();

  // Set active tab - ensure it's an accessible one
  useEffect(() => {
    if (!accessibleTabs.includes(activeTab)) {
      setActiveTab(accessibleTabs[0]);
    }
  }, [userLevel, activeTab]);

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

  // Helper function to check if a tab should be visible
  const isTabVisible = (tabName) => {
    return accessibleTabs.includes(tabName);
  };

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
        {isTabVisible("enrollments") && (
          <button
            className={`tab-button ${
              activeTab === "enrollments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("enrollments")}
          >
            Enrollments
          </button>
        )}

        {isTabVisible("applicants") && (
          <button
            className={`tab-button ${
              activeTab === "applicants" ? "active" : ""
            }`}
            onClick={() => setActiveTab("applicants")}
          >
            Job Applicants
          </button>
        )}

        {/* {isTabVisible("reviews") && (
          <button
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        )} */}

        {isTabVisible("users") && (
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        )}

        {isTabVisible("employee-handbook") && (
          <button
            className={`tab-button ${
              activeTab === "employee-handbook" ? "active" : ""
            }`}
            onClick={() => setActiveTab("employee-handbook")}
          >
            Employee Handbook
          </button>
        )}

        {isTabVisible("parent-handbook") && (
          <button
            className={`tab-button ${
              activeTab === "parent-handbook" ? "active" : ""
            }`}
            onClick={() => setActiveTab("parent-handbook")}
          >
            Parent Handbook
          </button>
        )}
      </div>

      <div className="tab-content">
        {activeTab === "enrollments" && (
          <div className="applicants-section">
            <div className="section-header">
              <h2>Enrollments</h2>
              <Link to="/viewform">
                <button className="approve-button">Enrollment Form</button>
              </Link>
            </div>
            <EnrollmentList branchId={id} />
          </div>
        )}

        {activeTab === "applicants" && isTabVisible("applicants") && (
          <div className="applicants-section">
            <div className="section-header">
              <h2>Job Applicants</h2>
            </div>
            <ApplicantList branchId={id} />
          </div>
        )}

        {activeTab === "users" && isTabVisible("users") && <BranchUsers />}

        {activeTab === "employee-handbook" &&
          isTabVisible("employee-handbook") && (
            <HandbookManager branchId={id} type="employee" />
          )}

        {activeTab === "parent-handbook" && isTabVisible("parent-handbook") && (
          <HandbookManager branchId={id} type="parent" />
        )}

        {/* {activeTab === "reviews" && isTabVisible("reviews") && (
          <Reviews id={id} />
        )} */}
      </div>
    </div>
  );
};

export default BranchPage;
