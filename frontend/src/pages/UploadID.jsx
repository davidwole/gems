import "../styles/UploadID.css";
import { Upload, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UploadID() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [idType, setIdType] = useState("");
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
    if (selectedFile && idType) {
      // TODO: Implement file upload logic
      console.log(selectedFile);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Upload ID</h1>
        </div>
      </div>
      <div className="dashboard-content">
        <form onSubmit={handleSubmit} className="id-upload-section">
          <div className="data-admin-section">
            <h3>Select ID Type</h3>
            <div className="action-buttons">
              {["Passport", "Driver's License", "National ID", "Other"].map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    className={`action-button ${
                      idType === type ? "selected" : ""
                    }`}
                    onClick={() => setIdType(type)}
                  >
                    {type}
                  </button>
                )
              )}
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
              <p>Drag and drop your ID document here</p>
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
              disabled={!selectedFile || !idType}
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
