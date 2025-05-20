import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/post-review.css";
import { API_URL } from "../services/api";

const PostReview = () => {
  const { branchId } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [branchName, setBranchName] = useState("");

  useEffect(() => {
    // Fetch branch details to display the name
    const fetchBranchDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/branches/${user.branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBranchName(data.name);
        }
      } catch (error) {
        console.error("Error fetching branch details:", error);
      }
    };

    if (user && token) {
      fetchBranchDetails();
    }
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: user.id,
          branch: user.branch,
          review,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setReview("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("An error occurred while submitting your review");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (!user) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="post-review">
      <header className="review-header">
        <div className="review-title">
          <h1>Post Review</h1>
        </div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">{user.role}</span>
        </div>
      </header>

      <div className="review-content">
        <div className="review-form-container">
          <h2>Share Your Experience</h2>
          {branchName && <p className="branch-name">Branch: {branchName}</p>}

          {success ? (
            <div className="success-message">
              <p>Thank you! Your review has been submitted successfully.</p>
              <p>Redirecting to dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              <div className="form-group">
                <label htmlFor="review">Your Review</label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Please share your thoughts and experience with us..."
                  required
                  rows={8}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostReview;
