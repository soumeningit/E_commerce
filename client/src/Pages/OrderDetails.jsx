import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getOrderDetailsAPI,
  submitReviewAPI,
} from "../Service/Operations/OrderAPI";
import { useSelector } from "react-redux";
import { LuIndianRupee } from "react-icons/lu";
import toast from "react-hot-toast";

function OrderDetails() {
  const location = useLocation();
  const { order_id, product_id } = location.state || {};
  const { user, token } = useSelector((state) => state.auth);

  const [orderDetails, setOrderDetails] = useState(null);
  const [review, setReview] = useState({
    email: user?.email || "",
    message: "",
    rating: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const response = await getOrderDetailsAPI(
          "GET",
          { productId: product_id, userId: user.id },
          token
        );
        if (response.status === 200) {
          setOrderDetails(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    getOrderDetails();
  }, [product_id, user.id, token]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (rating) => {
    setReview((prev) => ({ ...prev, rating }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        userId: user.id,
        productId: product_id,
        orderId: order_id,
        ...review,
      };

      const response = await submitReviewAPI("POST", data, token);
      if (response.status === 200) {
        toast.success("Review submitted successfully!");
      }

      setReview({ email: user?.email || "", message: "", rating: 0 });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Order Details Section */}
        {orderDetails ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="flex justify-center">
              <img
                src={orderDetails.product_image}
                alt={orderDetails.product_name}
                className="w-full max-w-sm h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {orderDetails.product_name}
              </h1>
              <p className="text-lg text-gray-600">
                {orderDetails.medium_desc}
              </p>
              <p className="text-gray-700">{orderDetails.long_desc}</p>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-900">
                  <span className="flex space-x-2">
                    Price: <LuIndianRupee className="mt-1.5 ml-1.5" />
                    {orderDetails.product_mrp}
                  </span>
                </p>
                <p className="text-gray-600">
                  Order ID: {orderDetails.order_id}
                </p>
                <p className="text-gray-600">
                  Order Date:{" "}
                  {new Date(
                    orderDetails.order_completion_time
                  ).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Payment ID: {orderDetails.online_payment_id}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-lg text-gray-600">Loading order details...</p>
          </div>
        )}

        {/* Review Section */}
        <div className="border-t border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Submit Your Review
          </h2>
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={review.email}
                onChange={handleReviewChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-cyan-400 focus:ring-cyan-400 sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Review
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={review.message}
                onChange={handleReviewChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className={`text-2xl ${
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } focus:outline-none`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={submitting || review.rating === 0}
                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
