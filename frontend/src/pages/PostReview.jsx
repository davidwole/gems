import "../styles/PostReview.css";
import { Send, Star } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../services/api";

export default function PostReview() {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && review && rating > 0) {
      setIsSubmitting(true);
      try {
        await postReview();
        // Reset form after successful submission
        setName("");
        setReview("");
        setRating(0);
        alert("Review posted successfully!");
      } catch (error) {
        console.error("Error posting review:", error);
        alert("Failed to post review. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const postReview = async () => {
    // TODO: Replace with your actual API endpoint
    const reviewData = {
      name,
      review,
      rating,
    };

    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error("Failed to post review");
    }

    return response.json();
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Post Review</h1>
        </div>
      </div>
      <div className="dashboard-content">
        <form onSubmit={handleSubmit} className="review-form-section">
          <div className="data-admin-section">
            <h3>Share Your Experience</h3>

            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Rating:</label>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`star ${star <= rating ? "filled" : ""}`}
                    onClick={() => handleRatingClick(star)}
                  />
                ))}
                <span className="rating-text">
                  {rating > 0
                    ? `${rating} star${rating > 1 ? "s" : ""}`
                    : "Select rating"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="review">Review:</label>
              <textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
                className="form-textarea"
                rows={6}
                required
              />
            </div>
          </div>

          <div className="submit-section">
            <button
              type="submit"
              className={`action-button ${isSubmitting ? "submitting" : ""}`}
              disabled={!name || !review || rating === 0 || isSubmitting}
            >
              <Send size={18} />
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
