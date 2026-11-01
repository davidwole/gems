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
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const dragJustEndedRef = useRef(false);

  const getDocumentMimeType = (file) => {
    if (!file) return "application/octet-stream";
    if (file.type && file.type !== "application/octet-stream") {
      return file.type.toLowerCase();
    }
    const ext = file.name ? file.name.split(".").pop().toLowerCase() : "";
    if (ext === "pdf") return "application/pdf";
    if (ext === "heic" || ext === "heif") return "image/heic";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    if (ext === "webp") return "image/webp";
    if (ext === "gif") return "image/gif";
    return file.type || "application/octet-stream";
  };

  const isValidDocumentFile = (file) => {
    if (!file) return false;
    const allowedTypes = [
      "application/pdf",
      "image/heic",
      "image/heif",
      "image/heic-sequence",
      "image/heif-sequence",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (file.type && allowedTypes.includes(file.type.toLowerCase())) {
      return true;
    }
    const ext = file.name ? file.name.split(".").pop().toLowerCase() : "";
    const allowedExtensions = [
      "pdf",
      "heic",
      "heif",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
    ];
    return allowedExtensions.includes(ext);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let result = reader.result;
      if (typeof result === "string") {
        const mime = getDocumentMimeType(file);
        if (
          result.startsWith("data:;base64,") ||
          result.startsWith("data:application/octet-stream;base64,")
        ) {
          result = result.replace(/^data:[^;]*;base64,/, `data:${mime};base64,`);
        }
      }
      setPreviewSource(result);
    };
  };

  const processFile = (file) => {
    if (file && isValidDocumentFile(file)) {
      setSelectedFile(file);
      previewFile(file);
      setMessage(null);
    } else {
      setSelectedFile(null);
      setPreviewSource(null);
      setMessage({
        type: "error",
        text: "Please select a valid document or image file (PDF, HEIC, JPG, JPEG, PNG, GIF, WebP)",
      });
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current += 1;
    if (event.dataTransfer?.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    dragJustEndedRef.current = true;
    setTimeout(() => {
      dragJustEndedRef.current = false;
    }, 300);

    let file = null;
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      file = event.dataTransfer.files[0];
    } else if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      const item = event.dataTransfer.items[0];
      if (item.kind === "file") {
        file = item.getAsFile();
      }
    }

    if (file) {
      processFile(file);
      if (fileInputRef.current) {
        try {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        } catch {
          // DataTransfer fallback if not supported
        }
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAreaClick = () => {
    if (dragJustEndedRef.current) return;
    triggerFileInput();
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
        text: "Please select an ID type and a document file",
      });
      return;
    }

    if (!previewSource || typeof previewSource !== "string") {
      setMessage({
        type: "error",
        text: "Please wait for document to load",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Upload image and get URL
      const imageUrl = await uploadImage(previewSource);

      const mimeType = getDocumentMimeType(selectedFile);

      // Prepare document data
      const documentData = {
        user: renderUser?.id,
        enrollmentForm: applicant,
        url: imageUrl,
        documentType: documentType,
        filename: selectedFile.name,
        mimetype: mimeType,
        size: selectedFile.size,
      };

      const response = await uploadChildDocument(documentData, token);

      // If upload was successful, add the new document to the list
      if (response.success) {
        setDocuments([...documents, response.document]);
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
        alert(response.message || "Failed to upload document");
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
  }, [user]);

  const getFileBadge = () => {
    if (!selectedFile) return null;
    const ext = selectedFile.name
      ? selectedFile.name.split(".").pop().toLowerCase()
      : "";
    if (ext === "pdf" || selectedFile.type === "application/pdf") {
      return <span className="file-badge pdf">PDF</span>;
    }
    if (
      ext === "heic" ||
      ext === "heif" ||
      selectedFile.type?.includes("heic")
    ) {
      return <span className="file-badge heic">HEIC</span>;
    }
    return (
      <span className="file-badge image">
        {ext.toUpperCase() || "IMAGE"}
      </span>
    );
  };

  const isStandardImage = () => {
    if (!selectedFile) return false;
    const ext = selectedFile.name
      ? selectedFile.name.split(".").pop().toLowerCase()
      : "";
    return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Upload ID</h1>
        </div>
      </div>
      <div className="dashboard-content">
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

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
            className={`file-upload-area ${isDragging ? "dragging" : ""}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleAreaClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
              accept=".pdf,.heic,.heif,.jpg,.jpeg,.png,.gif,.webp,image/*,application/pdf"
            />
            <div className="file-upload-content">
              <Upload size={48} className="upload-icon" />
              <p>Drag and drop your ID document here</p>
              <p>or</p>
              <button
                type="button"
                className="action-button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
              >
                Select File
              </button>
              <span className="accepted-types-hint">
                Accepted formats: PDF, HEIC, JPG, JPEG, PNG, GIF, WebP
              </span>
            </div>
            {selectedFile && (
              <div className="selected-file">
                <div className="selected-file-header">
                  <FileText size={24} />
                  <span>{selectedFile.name}</span>
                  {getFileBadge()}
                </div>
                {previewSource && isStandardImage() && (
                  <div className="image-preview">
                    <img src={previewSource} alt="Preview" />
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
