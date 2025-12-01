import "../styles/UploadID.css";
import { Upload, FileText } from "lucide-react";
import { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { uploadChildDocument } from "../services/api";

export default function UploadID() {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const { applicant } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [previewSource, setPreviewSource] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setSelectedFile(file);
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
    setLoading(true);

    if (!selectedFile || !documentType) {
      setMessage({
        type: "error",
        text: "Please select a document type and image file",
      });
      setLoading(false);
      return;
    }

    if (!previewSource || typeof previewSource !== "string") {
      setMessage({
        type: "error",
        text: "Please wait for image to load",
      });
      setLoading(false);

      return;
    }

    setMessage(null);

    try {
      // Upload image and get URL
      const imageUrl = await uploadImage(previewSource);

      // Prepare document data
      const documentData = {
        user: renderUser?.id,
        enrollmentForm: applicant,
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
        navigate("/");
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
                      documentType === type ? "selected" : ""
                    }`}
                    onClick={() => setDocumentType(type)}
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
              disabled={!selectedFile || !documentType || loading}
            >
              {loading ? "Loading" : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
