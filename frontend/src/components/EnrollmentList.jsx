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

    const fetchEnrollments = async (token) => {
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
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [branchId, token]);

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
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "name") {
      const nameA = a.printName || "";
      const nameB = b.printName || "";
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    return 0;
  });

  const getChildrenCount = (enrollment) => {
    const children = [
      enrollment.enrolledChildOne,
      enrollment.enrolledChildTwo,
      enrollment.enrolledChildThree,
      enrollment.enrolledChildFour,
      enrollment.enrolledChildFive,
    ];
    return children.filter((child) => child && child.name).length;
  };

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
                <h3>{enrollment.printName || "Unnamed"}</h3>
                <div className="enrollment-meta">
                  <span>
                    Submitted:{" "}
                    {formatDate(enrollment.createdAt || enrollment.date)}
                  </span>
                  <span>Children: {getChildrenCount(enrollment)}</span>
                </div>
              </div>
              <div className="enrollment-status-section">
                <div
                  className={`status-badge ${
                    enrollment.determiningSignature != "" &&
                    enrollment.confirmingSignature != "" &&
                    enrollment.followUpSignatures != ""
                      ? "approved"
                      : "pending"
                  }`}
                >
                  {enrollment.determiningSignature != "" &&
                  enrollment.confirmingSignature != "" &&
                  enrollment.followUpSignatures != ""
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
                  <h4>Contact Information</h4>
                  <div className="detail-row">
                    <span>Name:</span> {enrollment.printName || "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Address:</span>{" "}
                    {enrollment.address
                      ? `${enrollment.address}, ${enrollment.city}, ${enrollment.state} ${enrollment.zip}`
                      : "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Phone:</span> {enrollment.phone || "N/A"}
                  </div>
                </div>

                <div className="enrollment-detail-section">
                  <h4>Enrolled Children</h4>
                  {[
                    enrollment.enrolledChildOne,
                    enrollment.enrolledChildTwo,
                    enrollment.enrolledChildThree,
                    enrollment.enrolledChildFour,
                    enrollment.enrolledChildFive,
                  ]
                    .filter((child) => child && child.name)
                    .map((child, index) => (
                      <div key={index} className="child-entry">
                        <div className="detail-row">
                          <span>Name:</span> {child.name}
                        </div>
                        {child.caseNumber && (
                          <div className="detail-row">
                            <span>Case Number:</span> {child.caseNumber}
                          </div>
                        )}
                        <div className="detail-row">
                          <span>Special Programs:</span>{" "}
                          {[
                            child.headStart && "Head Start",
                            child.fosterChild && "Foster Child",
                            child.migrant && "Migrant",
                            child.runaway && "Runaway",
                            child.homeless && "Homeless",
                          ]
                            .filter(Boolean)
                            .join(", ") || "None"}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="enrollment-detail-section">
                  <h4>Schedule Information</h4>
                  <div className="detail-row">
                    <span>Hours:</span>{" "}
                    {enrollment.facilityStartHours &&
                    enrollment.facilityEndHours
                      ? `${enrollment.facilityStartHours} - ${enrollment.facilityEndHours}`
                      : "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Days:</span>{" "}
                    {enrollment.centerAttendanceDays
                      ? Object.entries(enrollment.centerAttendanceDays)
                          .filter(([_, value]) => value === true)
                          .map(([day]) => day)
                          .join(", ")
                      : "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Meals:</span>{" "}
                    {enrollment.mealsReceived
                      ? Object.entries(enrollment.mealsReceived)
                          .filter(([_, value]) => value === true)
                          .map(([meal]) => meal)
                          .join(", ")
                      : "N/A"}
                  </div>
                  {enrollment.determiningSignature != "" &&
                  enrollment.confirmingSignature != "" &&
                  enrollment.followUpSignatures != "" ? (
                    <p>Signed</p>
                  ) : (
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
