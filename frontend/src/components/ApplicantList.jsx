import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getJobApplicationsByBranch } from "../services/api";
import "../styles/applicant-list.css";

export default function ApplicantList({ branchId }) {
  console.log(branchId);
  const { token } = useContext(AuthContext);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchApplicants = async () => {
    console.log(branchId);
    setLoading(true);
    try {
      const response = await getJobApplicationsByBranch(branchId, token);
      if (response.success) {
        setApplicants(response.data);
      } else {
        setError("Failed to fetch applicants");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && branchId) {
      fetchApplicants();
    }
  }, [branchId, token]);

  const handleViewApplication = (applicationId) => {
    navigate(`/application/${applicationId}`);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "reviewing":
        return "status-reviewing";
      case "interviewed":
        return "status-interviewed";
      case "rejected":
        return "status-rejected";
      case "accepted":
        return "status-accepted";
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading-container">Loading applicants...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="applicant-list-container">
      {applicants.length > 0 ? (
        <div className="applicant-grid">
          {applicants.map((applicant) => (
            <div key={applicant._id} className="applicant-card">
              <div className="applicant-info">
                <h3>{`${applicant.firstName} ${applicant.lastName}`}</h3>
                <p className="applicant-position">
                  Position: <span>{applicant.position || "Not specified"}</span>
                </p>
                <p className="applicant-email">{applicant.email}</p>
                <p className="applicant-phone">
                  {applicant.phone || "No phone provided"}
                </p>
                <p className="application-date">
                  Applied: {formatDate(applicant.createdAt)}
                </p>
              </div>
              <div className="applicant-status-section">
                <span
                  className={`applicant-status ${getStatusClass(
                    applicant.status
                  )}`}
                >
                  {applicant.status.charAt(0).toUpperCase() +
                    applicant.status.slice(1)}
                </span>
                {applicant.interviewDate && (
                  <p className="interview-date">
                    Interview: {formatDate(applicant.interviewDate)}
                  </p>
                )}
              </div>
              <div className="applicant-actions">
                <button
                  className="view-button"
                  onClick={() => handleViewApplication(applicant._id)}
                >
                  View Application
                </button>
                {/* <button className="status-update-button">Update Status</button> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="content-placeholder">
          <p>No applicants data available for this branch.</p>
        </div>
      )}
    </div>
  );
}
