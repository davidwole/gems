import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/enrollment-list.css";
import { API_URL } from "../services/api";
import { Link, useParams } from "react-router-dom";

export default function EnrollmentList({ branchId }) {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!token || !branchId) return;

    const fetchEnrollments = async () => {
      try {
        const response = await fetch(
          `${API_URL}/enrollment-forms/branch/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setEnrollments(data.data);
        console.log(data.data);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [branchId, token, id]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filterStatus === "all") return true;
    return enrollment.status === filterStatus;
  });

  // Sort enrollments
  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.createdAt || a.dateEnrolled || a.date);
      const dateB = new Date(b.createdAt || b.dateEnrolled || b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "name") {
      const nameA = a.childName || "";
      const nameB = b.childName || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <div className="loading">Loading enrollment data...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!enrollments.length)
    return <div className="no-data">No enrollment forms found.</div>;

  return (
    <div className="enrollment-list-container">
      <div className="enrollment-controls">
        <div className="enrollment-filters">
          <label>
            Sort by:
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-by"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
          </label>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="sort-order-button"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
        <div className="enrollment-count">
          Showing {filteredEnrollments.length} of {enrollments.length}
        </div>
      </div>

      <div className="enrollment-list">
        {sortedEnrollments.map((enrollment) => (
          <div
            key={enrollment._id}
            className={`enrollment-card ${
              expandedId === enrollment._id ? "expanded" : ""
            }`}
          >
            <div
              className="enrollment-header"
              onClick={() => toggleExpand(enrollment._id)}
            >
              <div className="enrollment-summary">
                <h3>{enrollment.childName || "Unnamed Child"}</h3>
                <div className="enrollment-meta">
                  <span>
                    Submitted:{" "}
                    {formatDate(
                      enrollment.createdAt ||
                        enrollment.dateEnrolled ||
                        enrollment.date
                    )}
                  </span>
                </div>
              </div>
              <div className="enrollment-status-section">
                <div
                  className={`status-badge ${
                    enrollment.directorSignature ? "approved" : "pending"
                  }`}
                >
                  {enrollment.directorSignature
                    ? "Signed"
                    : "Pending Signature"}
                </div>
                <button className="expand-button">
                  {expandedId === enrollment._id ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {expandedId === enrollment._id && (
              <div className="enrollment-details">
                <div className="enrollment-detail-section">
                  <h4>Child Information</h4>
                  <div className="detail-row">
                    <span>Name:</span> {enrollment.childName || "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Date of Birth:</span>{" "}
                    {formatDate(enrollment.dateOfBirth)}
                  </div>
                  <div className="detail-row">
                    <span>Gender:</span> {enrollment.gender || "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Age:</span> {enrollment.age || "N/A"}
                  </div>
                </div>

                <div className="enrollment-detail-section">
                  <h4>Sponsor Information</h4>
                  <div className="detail-row">
                    <span>Name:</span> {enrollment.sponsorName || "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Address:</span>{" "}
                    {enrollment.sponsorAddress?.street
                      ? `${enrollment.sponsorAddress.street}, ${
                          enrollment.sponsorAddress.city || ""
                        }, ${enrollment.sponsorAddress.state || ""} ${
                          enrollment.sponsorAddress.zipCode || ""
                        }`
                      : "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Cell Phone:</span>{" "}
                    {enrollment.sponsorCellPhone || "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Work Phone:</span>{" "}
                    {enrollment.sponsorWorkPhone || "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Email:</span> {enrollment.sponsorEmail || "N/A"}
                  </div>
                </div>

                {enrollment.coSponsorName && (
                  <div className="enrollment-detail-section">
                    <h4>Co-Sponsor Information</h4>
                    <div className="detail-row">
                      <span>Name:</span> {enrollment.coSponsorName}
                    </div>
                    <div className="detail-row">
                      <span>Address:</span>{" "}
                      {enrollment.coSponsorAddress?.street
                        ? `${enrollment.coSponsorAddress.street}, ${
                            enrollment.coSponsorAddress.city || ""
                          }, ${enrollment.coSponsorAddress.state || ""} ${
                            enrollment.coSponsorAddress.zipCode || ""
                          }`
                        : "N/A"}
                    </div>
                    <div className="detail-row">
                      <span>Cell Phone:</span>{" "}
                      {enrollment.coSponsorCellPhone || "N/A"}
                    </div>
                    <div className="detail-row">
                      <span>Work Phone:</span>{" "}
                      {enrollment.coSponsorWorkPhone || "N/A"}
                    </div>
                    <div className="detail-row">
                      <span>Email:</span> {enrollment.coSponsorEmail || "N/A"}
                    </div>
                  </div>
                )}

                <div className="enrollment-detail-section">
                  <h4>Enrollment Details</h4>
                  <div className="detail-row">
                    <span>Date Enrolled:</span>{" "}
                    {formatDate(enrollment.dateEnrolled)}
                  </div>
                  <div className="detail-row">
                    <span>Date Completed:</span>{" "}
                    {formatDate(enrollment.dateCompleted) || "Not completed"}
                  </div>
                  <div className="detail-row">
                    <span>Director:</span>{" "}
                    {enrollment.directorName || "Not assigned"}
                  </div>
                  {!enrollment.directorSignature && (
                    <Link to={`/signing/${enrollment._id}`}>
                      <button className="approve-button">Sign</button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
