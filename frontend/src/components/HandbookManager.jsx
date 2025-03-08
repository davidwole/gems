import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL, getHandbookInfo, uploadHandbook } from "../services/api";
import "../styles/handbook.css";

const HandbookManager = ({ branchId, type }) => {
  const { token, user } = useContext(AuthContext);
  const [handbookInfo, setHandbookInfo] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Check if user has permission to upload
  const canUpload = user && (user.role === "L1" || user.role === "L2");

  // Fetch handbook info
  useEffect(() => {
    const fetchHandbookInfo = async () => {
      setLoading(true);
      try {
        const info = await getHandbookInfo(branchId, type, token);
        setHandbookInfo(info);

        // Set the PDF URL directly to the API endpoint
        if (info) {
          setPdfUrl(`${API_URL}/handbooks/${branchId}/${type}?t=${Date.now()}`);
        } else {
          setPdfUrl(null);
        }
      } catch (err) {
        console.error("Error fetching handbook:", err);
        setError("Failed to load handbook information");
      } finally {
        setLoading(false);
      }
    };

    if (branchId && type && token) {
      fetchHandbookInfo();
    }
  }, [branchId, type, token]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setFile(null);
      e.target.value = null;
      return;
    }

    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      setFile(null);
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const result = await uploadHandbook(branchId, type, file, token);
      setHandbookInfo({
        filename: result.filename,
        updatedAt: result.updatedAt,
      });
      setPdfUrl(`/api/handbooks/${branchId}/${type}?t=${Date.now()}`);
      setSuccessMessage("Handbook uploaded successfully");
      setFile(null);

      // Reset the file input
      const fileInput = document.getElementById("handbook-file");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload handbook");
    } finally {
      setUploading(false);
    }
  };

  // Format the handbook title
  const formatTitle = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + " Handbook";
  };

  return (
    <div className="handbook-manager">
      <div className="section-header">
        <h2>{formatTitle(type)}</h2>
        {canUpload && (
          <button
            className="action-button upload-btn"
            onClick={() => document.getElementById("handbook-file").click()}
          >
            {handbookInfo ? "Replace Handbook" : "Upload Handbook"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-message">Loading handbook...</div>
      ) : (
        <div className="handbook-content">
          {/* File upload section (hidden input, shown when user has permissions) */}
          {canUpload && (
            <div className="upload-section">
              <input
                type="file"
                id="handbook-file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {file && (
                <div className="selected-file">
                  <p>Selected file: {file.name}</p>
                  <div className="upload-actions">
                    <button
                      className="upload-confirm-btn"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Confirm Upload"}
                    </button>
                    <button
                      className="upload-cancel-btn"
                      onClick={() => {
                        setFile(null);
                        document.getElementById("handbook-file").value = "";
                      }}
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {error && <div className="error-message">{error}</div>}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
            </div>
          )}

          {/* Handbook display section */}
          {handbookInfo ? (
            <div className="handbook-display">
              <div className="handbook-info">
                <p>
                  <strong>Filename:</strong> {handbookInfo.filename}
                </p>
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {new Date(handbookInfo.updatedAt).toLocaleString()}
                </p>
              </div>

              <div className="pdf-container">
                <iframe
                  src={pdfUrl}
                  title={`${type} handbook`}
                  width="100%"
                  height="600px"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="content-placeholder">
              <p>No {type} handbook available for this branch.</p>
              {canUpload && (
                <p>Upload a PDF handbook using the button above.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HandbookManager;
