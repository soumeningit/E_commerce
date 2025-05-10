import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  getProductByIdAPI,
  deleteProductByIdAPI,
} from "../Service/Operations/ProductOpern";

function Products() {
  const { user, token } = useSelector((state) => state.auth);
  const [userProducts, setUserProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);
  const productsPerPage = 5;

  const getProducts = async () => {
    const toastId = toast.loading("Getting Product...");
    try {
      const response = await getProductByIdAPI(
        "GET",
        { userId: user.id },
        token
      );
      if (response.status === 200) {
        setUserProducts(response.data.data);
      }
    } catch (e) {
      toast.error("Error in getting products");
      console.log("GET PRODUCTS API ERROR : ", e);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDelete = async (productId) => {
    const toastId = toast.loading("Deleting Product...");
    try {
      const response = await deleteProductByIdAPI(
        "DELETE",
        { productId },
        token
      );
      if (response.status === 200) {
        setUserProducts(
          userProducts.filter((product) => product.product_id !== productId)
        );
        toast.success("Product deleted successfully");
      }
    } catch (e) {
      toast.error("Error deleting product");
      console.log("DELETE PRODUCT API ERROR : ", e);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const openModal = (product) => {
    setModalProduct(product);
  };

  const closeModal = () => {
    setModalProduct(null);
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = userProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(userProducts.length / productsPerPage);

  // Calculate total sales
  const totalSales = userProducts.reduce((sum, product) => {
    const soldQuantity = product.initial_quantity - product.current_stk;
    return sum + soldQuantity * parseFloat(product.product_price);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Products</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Sales:{" "}
            <span className="text-green-600">₹{totalSales.toFixed(2)}</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                src={product.product_image.replace(/\[|\]/g, "")}
                alt={product.product_name}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <h3 className="text-md font-semibold text-gray-800 truncate">
                  {product.product_name}
                </h3>
                <p className="text-gray-600 text-sm">
                  Price: ₹{product.product_price}
                </p>
                <p className="text-gray-600 text-sm">
                  Stock: {product.current_stk}
                </p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleDelete(product.product_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openModal(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition cursor-pointer text-sm"
                  >
                    Show More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {userProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No products found.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

        {modalProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {modalProduct.product_name}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <img
                src={modalProduct.product_image.replace(/\[|\]/g, "")}
                alt={modalProduct.product_name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <p className="text-gray-700">
                <span className="font-semibold">Medium Description:</span>{" "}
                {modalProduct.medium_desc}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Long Description:</span>{" "}
                {modalProduct.long_desc}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Units Sold:</span>{" "}
                {modalProduct.initial_quantity - modalProduct.current_stk}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Earnings from Product:</span> ₹
                {(
                  (modalProduct.initial_quantity - modalProduct.current_stk) *
                  parseFloat(modalProduct.product_price)
                ).toFixed(2)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Reviews:</span> No reviews
                available
              </p>
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
