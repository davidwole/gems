import "../styles/UploadDocuments.css";
import { Upload, FileText } from "lucide-react";
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { uploadChildDocument } from "../services/api";

export default function UploadDocuments() {
  const { user, token } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile || !documentType) {
      setMessage({
        type: "error",
        text: "Please select a document type and file",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const documentData = {
        user: user._id,
        documentType: documentType,
      };

      const response = await uploadChildDocument(
        documentData,
        selectedFile,
        token
      );

      // If upload was successful, add the new document to the list
      if (response.success) {
        setDocuments([...documents, response.document]);
        setMessage({
          type: "success",
          text: "Document uploaded successfully",
        });
        // Reset form
        setSelectedFile(null);
        setDocumentType("");
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to upload document",
        });
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setMessage({
        type: "error",
        text: error.message || "An error occurred while uploading the document",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Upload Child Documents</h1>
        </div>
      </div>
      <div className="dashboard-content">
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit} className="document-upload-section">
          <div className="data-admin-section">
            <h3>Select Document Type</h3>
            <div className="action-buttons">
              {[
                "Birth Certificate",
                "Medical Records",
                "School Records",
                "Immunization Records",
                "Other",
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`action-button ${
                    documentType === type ? "selected" : ""
                  }`}
                  onClick={() => setDocumentType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div
            className="file-upload-area"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div className="file-upload-content">
              <Upload size={48} className="upload-icon" />
              <p>Drag and drop your child's document here</p>
              <p>or</p>
              <button type="button" className="action-button">
                Select File
              </button>
            </div>
            {selectedFile && (
              <div className="selected-file">
                <FileText size={24} />
                <span>{selectedFile.name}</span>
              </div>
            )}
          </div>

          <div className="submit-section">
            <button
              type="submit"
              className="action-button"
              disabled={!selectedFile || !documentType || loading}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
