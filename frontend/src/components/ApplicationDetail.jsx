import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/application-detail.css";
import { API_URL } from "../services/api";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const { token } = useContext(AuthContext);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/job-applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch application details");
        }

        const data = await response.json();
        if (data.success) {
          setApplication(data.data);
        } else {
          setError(data.message || "Failed to load application");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token && applicationId) {
      fetchApplicationDetail();
    }
  }, [applicationId, token]);

  const handleStatusChange = async (status) => {
    try {
      const response = await fetch(
        `http://${API_URL}/job-applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      if (data.success) {
        // Update the application state with the new status
        setApplication((prev) => ({ ...prev, status: status }));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const handleScheduleInterview = () => {
    // This would open a modal or navigate to an interview scheduling form
    // For now, just a placeholder
    alert("Interview scheduling feature coming soon");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">Loading application details...</div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!application) {
    return <div className="error-container">Application not found</div>;
  }

  return (
    <div className="application-detail-container">
      <div className="application-detail-header">
        <button className="back-button" onClick={handleBack}>
          ← Back to List
        </button>
        <h2>Job Application Details</h2>
        <div className="status-badge" data-status={application.status}>
          {application.status.charAt(0).toUpperCase() +
            application.status.slice(1)}
        </div>
      </div>

      <div className="application-content">
        <div className="personal-info-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{`${application.firstName} ${
                application.middleName ? application.middleName + " " : ""
              }${application.lastName}`}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{application.email}</p>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <p>{application.phone || "Not provided"}</p>
            </div>
            <div className="info-item">
              <label>Address</label>
              <p>
                {application.streetAddress && application.city
                  ? `${application.streetAddress}, ${application.city}, ${application.state} ${application.zipCode}`
                  : "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="job-details-section">
          <h3>Job Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Position</label>
              <p>{application.position || "Not specified"}</p>
            </div>
            <div className="info-item">
              <label>Date Available</label>
              <p>{application.dateAvailable || "Not specified"}</p>
            </div>
            <div className="info-item">
              <label>Desired Salary</label>
              <p>{application.desiredSalary || "Not specified"}</p>
            </div>
            <div className="info-item">
              <label>Hours Preference</label>
              <p>
                {application.hoursPreference
                  ? application.hoursPreference === "fullTime"
                    ? "Full-Time"
                    : application.hoursPreference === "partTime"
                    ? "Part-Time"
                    : "Any Hours"
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* Add more sections as needed - Education, Employment History, etc. */}

        <div className="application-actions">
          <div className="status-actions">
            <h3>Update Status</h3>
            <div className="status-buttons">
              <button
                className={`status-button ${
                  application.status === "pending" ? "active" : ""
                }`}
                onClick={() => handleStatusChange("pending")}
              >
                Pending
              </button>
              <button
                className={`status-button ${
                  application.status === "reviewing" ? "active" : ""
                }`}
                onClick={() => handleStatusChange("reviewing")}
              >
                Reviewing
              </button>
              <button
                className={`status-button ${
                  application.status === "interviewed" ? "active" : ""
                }`}
                onClick={() => handleStatusChange("interviewed")}
              >
                Interviewed
              </button>
              <button
                className={`status-button ${
                  application.status === "rejected" ? "active" : ""
                }`}
                onClick={() => handleStatusChange("rejected")}
              >
                Rejected
              </button>
              <button
                className={`status-button ${
                  application.status === "accepted" ? "active" : ""
                }`}
                onClick={() => handleStatusChange("accepted")}
              >
                Accepted
              </button>
            </div>
          </div>

          <div className="interview-section">
            <h3>Interview</h3>
            {application.interviewDate ? (
              <div className="interview-info">
                <p>
                  <strong>Date:</strong> {formatDate(application.interviewDate)}
                </p>
                <p>
                  <strong>Location:</strong> {application.interviewLocation}
                </p>
                <button
                  className="reschedule-button"
                  onClick={handleScheduleInterview}
                >
                  Reschedule
                </button>
              </div>
            ) : (
              <button
                className="schedule-button"
                onClick={handleScheduleInterview}
              >
                Schedule Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
