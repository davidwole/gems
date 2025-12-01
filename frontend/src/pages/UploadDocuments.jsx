import "../styles/UploadDocuments.css";
import { Upload, FileText } from "lucide-react";
import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { uploadChildDocument } from "../services/api";
import { useParams } from "react-router-dom";

export default function UploadDocuments() {
  const { enrollmentformId } = useParams();
  const { user, token } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [renderUser, setRenderUser] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && isValidImageFile(file)) {
      setSelectedFile(file);
      previewFile(file);
      setMessage(null);
    } else {
      setMessage({
        type: "error",
        text: "Please select a valid image file (JPG, JPEG, PNG, GIF, WebP)",
      });
    }
  };

  const isValidImageFile = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return allowedTypes.includes(file.type);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && isValidImageFile(file)) {
      setSelectedFile(file);
      previewFile(file);
      setMessage(null);
    } else {
      setMessage({
        type: "error",
        text: "Please select a valid image file (JPG, JPEG, PNG, GIF, WebP)",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      const response = await fetch(
        `https://designsurvey.onrender.com/api/upload`,
        {
          method: "POST",
          body: JSON.stringify({ data: base64EncodedImage }),
          headers: { "Content-type": "application/json" },
        }
      );
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile || !documentType) {
      setMessage({
        type: "error",
        text: "Please select a document type and image file",
      });
      return;
    }

    if (!previewSource || typeof previewSource !== "string") {
      setMessage({
        type: "error",
        text: "Please wait for image to load",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Upload image and get URL
      const imageUrl = await uploadImage(previewSource);

      // Prepare document data
      const documentData = {
        user: renderUser?.id,
        enrollmentForm: enrollmentformId,
        url: imageUrl,
        documentType: documentType,
        filename: selectedFile.name,
        mimetype: selectedFile.type,
        size: selectedFile.size,
      };

      const response = await uploadChildDocument(documentData, token);

      // If upload was successful, add the new document to the list
      if (response.success) {
        setDocuments([...documents, response.document]);
        // setMessage({
        //   type: "success",
        //   text: "Document uploaded successfully",
        // });
        alert(`${documentData.documentType} uploaded successfully`);
        // Reset form
        setSelectedFile(null);
        setPreviewSource(null);
        setDocumentType("");
      } else {
        setMessage({
          type: "error",
          text: response.message || "Failed to upload document",
        });
        alert(setMessage.text);
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

  useEffect(() => {
    if (user) {
      setRenderUser(user);
    }
  });

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
              accept="image/*"
            />
            <div className="file-upload-content">
              <Upload size={48} className="upload-icon" />
              <p>Drag and drop your child's document image here</p>
              <p>or</p>
              <button type="button" className="action-button">
                Select Image
              </button>
              <small>Accepted formats: JPG, JPEG, PNG, GIF, WebP</small>
            </div>
            {selectedFile && (
              <div className="selected-file">
                <FileText size={24} />
                <span>{selectedFile.name}</span>
                {previewSource && (
                  <div className="image-preview">
                    <img
                      src={previewSource}
                      alt="Preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "10px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="submit-section">
            <button
              type="submit"
              className="action-button"
              disabled={
                !selectedFile || !documentType || loading || !previewSource
              }
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
