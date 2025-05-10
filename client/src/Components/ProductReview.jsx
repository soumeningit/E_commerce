import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getProductReviewsAPI } from "../Service/Operations/ProductOpern";

function ProductReview({ id }) {
  const [reviews, setReviews] = useState([]);
  const [showFullText, setShowFullText] = useState(false);

  // Placeholder for API call to fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await getProductReviewsAPI("GET", { productId: id });
        if (response.status === 200) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchReviews();
  }, [id]);

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  // Calculate average rating
  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;
  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Customer Reviews
        </h2>
        <div className="flex items-center mt-2">
          <div className="flex">{renderStars(averageRating)}</div>
          <span className="ml-2 text-gray-600 font-semibold">
            {averageRating} out of 5 ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews && reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-center mb-4 space-x-2">
                <div className="w-8 h-8 flex items-center justify-center border-gray-200 rounded-full overflow-hidden">
                  <img
                    src={review.image}
                    alt="user_image"
                    loading="lazy"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <p>
                  {review.firstName} {review.lastName}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="ml-2 text-gray-600 font-semibold">
                    {review.rating}
                  </span>
                </div>
                <div className="flex items-center mt-2 sm:mt-0">
                  <span className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                  {review.is_verified && (
                    <span className="ml-2 bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
              {/* Review Message */}
              <p className="text-gray-700 leading-relaxed mb-4">
                {review.message.length > 50 ? (
                  showFullText ? (
                    <>
                      {review.message}
                      <span
                        onClick={() => setShowFullText(false)}
                        className="text-indigo-600 cursor-pointer ml-2"
                      >
                        Show Less
                      </span>
                    </>
                  ) : (
                    <>
                      {review.message.slice(0, 50)}...
                      <span
                        onClick={() => setShowFullText(true)}
                        className="text-indigo-600 cursor-pointer ml-2"
                      >
                        Read More
                      </span>
                    </>
                  )
                ) : (
                  review.message
                )}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => alert("Review submission form to be implemented")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
}

export default ProductReview;
