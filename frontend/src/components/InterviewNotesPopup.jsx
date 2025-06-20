import { useState, useEffect } from "react";
import "../styles/InterviewNotesPopup.css";

const InterviewNotesPopup = ({
  isOpen,
  onClose,
  notes,
  onSave,
  applicationId,
  token,
}) => {
  const [interviewNotes, setInterviewNotes] = useState("");

  useEffect(() => {
    // Initialize the notes when the popup opens
    if (isOpen) {
      setInterviewNotes(notes || "");
    }
  }, [isOpen, notes]);

  const handleSave = async () => {
    try {
      await onSave(interviewNotes);
      onClose();
    } catch (error) {
      console.error("Error saving interview notes:", error);
      // You could add error handling UI here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content interview-notes-modal">
        <div className="modal-header">
          <h2>Interview Notes</h2>
          <button
            className="close-button"
            style={{ padding: "0.5rem 1rem" }}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <textarea
            className="interview-notes-textarea"
            value={interviewNotes}
            onChange={(e) => setInterviewNotes(e.target.value)}
            placeholder="Enter interview notes here..."
            rows={10}
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={handleSave}>
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewNotesPopup;
