import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL, getHandbook } from "../services/api";
import "../styles/employeeHandbookSign.css";
import Signature from "../components/Signature";

export default function EmployeeHandbookSign() {
  const { user, token } = useContext(AuthContext);
  const { branchId, type } = useParams();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check user role - only L6 users can access
    if (!user || user.role !== "L6") {
      navigate("/dashboard");
      return;
    }

    const fetchHandbook = async () => {
      try {
        setLoading(true);

        // Fetch the handbook PDF
        const response = await fetch(
          `${API_URL}/handbooks/${branchId}/employee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch handbook");
        }

        // Create a blob URL for the PDF
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        setError(err.message);
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHandbook();

    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [branchId, type, user, token, navigate]);

  const handleClose = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="handbook-preview-container">
        <div className="loading-spinner">Loading Handbook...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="handbook-preview-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={handleClose}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="handbook-preview-container">
      <div className="handbook-preview-header">
        <h2>Employee Handbook</h2>
        <button onClick={handleClose} className="close-button">
          Close
        </button>
      </div>

      {pdfUrl ? (
        <>
          <div className="pdf-viewer">
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="Handbook Preview"
              style={{ border: "none" }}
            />
          </div>
          <div>
            <Signature />
          </div>
        </>
      ) : (
        <div className="no-handbook-message">
          No handbook available for this branch.
        </div>
      )}
    </div>
  );
}
