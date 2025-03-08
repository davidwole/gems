import "../styles/UploadDocuments.css";
import { Upload, FileText } from "lucide-react";
import { useState, useRef } from "react";

export default function UploadDocuments() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile && documentType) {
      // TODO: Implement file upload logic
      console.log("Uploading file:", selectedFile);
      console.log("Document Type:", documentType);
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
              disabled={!selectedFile || !documentType}
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
