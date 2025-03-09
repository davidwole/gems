import { useState, useContext } from "react";
import { createReview } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/review.css";

const CreateReview = ({ branchId, onClose, onSuccess }) => {
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createReview(
        {
          branch: branchId,
          review: reviewText,
        },
        token
      );

      setLoading(false);
      // Call success handler to update parent component
      if (onSuccess) {
        onSuccess(reviewText);
      }
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="modal-container">
      <div className="modal-header">
        <h2>Post a Review</h2>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reviewText">Your Review:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="5"
            required
            placeholder="Write your review here..."
            className="form-control"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !reviewText.trim()}
          >
            {loading ? "Submitting..." : "Post Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;
