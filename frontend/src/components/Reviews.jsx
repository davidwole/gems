import { useContext, useEffect, useState } from "react";
import { getReviews } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Reviews() {
  const [reviews, setReviews] = useState(false);
  const { token } = useContext(AuthContext);

  const fetchReviews = async () => {
    const response = await getReviews(token);
    console.log(response);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div>
      {reviews ? (
        <div>
          {reviews.map((reviewItem) => {
            return (
              <div key={reviewItem._id}>
                <p>{reviewItem.review}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No reviews available. Create the first review for this branch.</p>
      )}
    </div>
  );
}
