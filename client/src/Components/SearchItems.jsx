import React from "react";
import { useNavigate } from "react-router-dom";

function SearchItems({ data, onClose }) {
  const navigate = useNavigate();

  function handleCardClick(id, name) {
    // const productData = data.find((item) => item.product_id === id);
    navigate(`/${name}/product-details/${id}`);
    onClose();
  }

  return (
    <div className="fixed inset-x-0 top-[80px] bottom-0 z-50 flex justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full bg-white rounded-b-lg shadow-2xl overflow-hidden transform transition-all duration-300 animate-slideDown">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Search Results</h1>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-semibold text-base transition-colors duration-200 flex items-center gap-2 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Close
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 max-h-[calc(100vh-144px)] overflow-y-auto">
          {data && data.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 cursor-pointer">
              {data.map((item) => (
                <div
                  key={item.product_id}
                  onClick={() =>
                    handleCardClick(item.product_id, item.product_name)
                  }
                  className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="

System: w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <h2 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
                      {item.product_name}
                    </h2>
                    <span className="text-sm text-gray-400 ">
                      ₹{item.product_mrp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchItems;
