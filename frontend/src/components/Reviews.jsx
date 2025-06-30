import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../services/api";
import { ChevronDown, ChevronUp, Check, X, Star, User } from "lucide-react";
import "../styles/Reviews.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const { user, token } = useContext(AuthContext);

  // Check if user can manage reviews (L1 or L2)
  const canManageReviews = user?.role === "L1" || user?.role === "L2";

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reviews`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const approveReview = async (reviewId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve review");
      }

      // Update local state
      setReviews(
        reviews.map((review) =>
          review._id === reviewId ? { ...review, isApproved: true } : review
        )
      );
    } catch (err) {
      alert("Failed to approve review: " + err.message);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Remove from local state
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (err) {
      alert("Failed to delete review: " + err.message);
    }
  };

  const renderStars = (rating) => {
    const numRating = parseInt(rating) || 0;
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`star ${star <= numRating ? "filled" : "empty"}`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "approved") return review.isApproved;
    if (filter === "pending") return !review.isApproved;
    return true;
  });

  if (loading) {
    return (
      <div className="reviews-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-container">
        <div className="error-state">
          <p>Error loading reviews: {error}</p>
          <button onClick={fetchReviews} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <div className="header-content">
          <h2>Customer Reviews</h2>
          <div className="reviews-stats">
            <span className="stat">Total: {reviews.length}</span>
            <span className="stat approved">
              Approved: {reviews.filter((r) => r.isApproved).length}
            </span>
            <span className="stat pending">
              Pending: {reviews.filter((r) => !r.isApproved).length}
            </span>
          </div>
        </div>

        {canManageReviews && (
          <div className="filter-controls">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Reviews</option>
              <option value="approved">Approved Only</option>
              <option value="pending">Pending Only</option>
            </select>
          </div>
        )}
      </div>

      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews found.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review._id} className="review-card">
              <div
                className="review-header"
                onClick={() => toggleExpanded(review._id)}
              >
                <div className="review-header-left">
                  <div className="reviewer-info">
                    <User size={18} className="user-icon" />
                    <span className="reviewer-name">{review.name}</span>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                    <span className="rating-text">({review.rating}/5)</span>
                  </div>
                </div>

                <div className="review-header-right">
                  <div
                    className={`status-tag ${
                      review.isApproved ? "approved" : "pending"
                    }`}
                  >
                    {review.isApproved ? "Approved" : "Pending"}
                  </div>
                  <button className="expand-button">
                    {expandedReviews.has(review._id) ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>

              {expandedReviews.has(review._id) && (
                <div className="review-content">
                  <div className="review-text">
                    <p>{review.review}</p>
                  </div>

                  {canManageReviews && (
                    <div className="review-actions">
                      {!review.isApproved && (
                        <button
                          onClick={() => approveReview(review._id)}
                          className="action-button approve-btn"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="action-button delete-btn"
                      >
                        <X size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
