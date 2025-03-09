import { useContext, useEffect, useState } from "react";
import { deleteReview, getReviews } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import CreateReview from "./CreateReview";

export default function Reviews({ id }) {
  const [reviews, setReviews] = useState([]);
  const [showCreateReview, setShowCreateReview] = useState(false);

  const { token } = useContext(AuthContext);

  const removeReview = async (id) => {
    const response = await deleteReview(id, token);

    setReviews(reviews.filter((review) => review._id != id));
  };

  const fetchReviews = async () => {
    try {
      const response = await getReviews(token, id);
      setReviews(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReviewCreated = (newReviewText) => {
    // Create a temporary review object until the page refreshes
    // In a real app, the API would return the complete review object
    const tempReview = {
      _id: `temp-${Date.now()}`,
      review: newReviewText,
      // Add any other properties that your review objects have
    };

    setReviews([...reviews, tempReview]);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <div className="reviews-section">
        <div className="section-header">
          <h2>Branch Reviews</h2>
          <button
            className="action-button"
            onClick={() => setShowCreateReview(true)}
          >
            Post New Review
          </button>
        </div>
        <div className="content-placeholder" id="remove-center">
          {reviews && reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((reviewItem) => (
                <div key={reviewItem._id} className="review-item">
                  <p>{reviewItem.review}</p>
                  <div>
                    <button className="action-button">Edit</button>
                    <button
                      className="action-button"
                      onClick={() => removeReview(reviewItem._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>
              No reviews available. Create the first review for this branch.
            </p>
          )}
        </div>
      </div>

      {/* Modal popup for creating review */}
      {showCreateReview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateReview
              branchId={id}
              onClose={() => setShowCreateReview(false)}
              onSuccess={handleReviewCreated}
            />
          </div>
        </div>
      )}
    </>
  );
}
