import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Modal from "../Components/Modal";
import { getCategoriesAPI } from "../Service/Operations/CategoryOpern";
import { createProductAPI } from "../Service/Operations/ProductOpern";
import SuccessModal from "../Components/SuccessModal";

function SellProduct() {
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    categoryId: "",
    userId: "",
    shortDescription: "",
    mediumDescription: "",
    longDescription: "",
    productImage: null,
    availableFrom: "",
    productMRP: "",
    quantity: 1,
  });

  const [categories, setCategories] = useState([]);

  const [showLongDescription, setShowLongDescription] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const userId = user?.id;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await getCategoriesAPI("GET", token);

        if (response.status === 200) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "shortDescription") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 100) {
        alert("Short Description should not exceed 100 words.");
        return;
      }
    }
    if (id === "mediumDescription") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 250) {
        alert("Medium Description should not exceed 250 words.");
        return;
      }
    }
    if (id === "longDescription") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 500) {
        alert("Short Description should not exceed 500 words.");
        return;
      }
    }

    setProductData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setProductData((prevData) => ({
      ...prevData,
      productImage: file,
    }));
    setPreviewUrl(URL.createObjectURL(file)); // for preview
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productMRP", productData.productMRP);
    formData.append("shortDescription", productData.shortDescription);
    formData.append("mediumDescription", productData.mediumDescription);
    formData.append("longDescription", productData.longDescription);
    formData.append("image", productData.productImage);
    formData.append("categoryId", productData.categoryId);
    formData.append("userId", userId);
    formData.append("quantity", productData.quantity);
    formData.append("availableFrom", productData.availableFrom);

    const toastId = toast.loading("Creating product...");
    try {
      const response = await createProductAPI("POST", formData, token);
      toast.dismiss(toastId);
      if (response.status === 401) {
        setShowModal(true);
        return;
      }

      if (response.status === 200) {
        toast.success("Product created successfully!");
        setShowSuccessModal(true);
        setProductData({
          productName: "",
          details: "",
          productPrice: "",
          categoryId: "",
          listedFor: "",
          userId: "",
          description: [],
          productImage: null,
          productLocation: "",
        });
        setPreviewUrl(null);
      }
      if (response.status === 401) {
        navigate("/dashboard/verify-user");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      toast.dismiss(toastId);
      if (error.response.status === 401) {
        setShowModal(true);
        return;
      }
      console.error("Error submitting form:", error);
    } finally {
      toast.dismiss(toastId);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Sell Your Product
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productData.productName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Product Image</label>
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-gray-300 px-6 py-8 text-center rounded-lg cursor-pointer bg-gray-50"
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto h-48 object-cover rounded-md cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setProductData((prev) => ({
                        ...prev,
                        productImage: null,
                      }));
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg hover:bg-red-100 transition cursor-pointer"
                  >
                    <AiFillCloseCircle className="text-red-600 text-xl cursor-pointer" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-400">
                  Drag & drop or click to upload an image
                </p>
              )}
              <p className="text-gray-500 mt-2">
                (Max file size: 2MB, accepted formats: JPG, PNG)
              </p>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Choose Category</label>
            <select
              id="categoryId"
              value={productData.categoryId}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option
                  key={index}
                  value={category.id}
                  title={category.categori_desc}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={productData.quantity}
              onChange={handleChange}
              placeholder="How many items you have"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Product Price</label>
            <input
              id="productPrice"
              value={productData.productPrice}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter product price"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Product MRP:</label>
            <input
              id="productMRP"
              value={productData.productMRP}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter product mrp"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Product Desciption:
            </label>
            <input
              id="shortDescription"
              value={productData.shortDescription}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter product details... Not more than 100 words"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Product Desciption:
            </label>
            <input
              id="mediumDescription"
              value={productData.mediumDescription}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter product details... Not more than 250 words"
              required
            />
          </div>

          <div>
            <label htmlFor="showLongDescription">
              Do you want add details description?
            </label>
            <input
              type="checkbox"
              name="checkbox"
              onChange={(e) => {
                setShowLongDescription(e.target.checked);
              }}
              className="ml-2"
            />
          </div>

          {showLongDescription && (
            <div>
              <label className="block font-medium mb-1">Product Details</label>
              <textarea
                id="longDescription"
                value={productData.longDescription}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Enter product details... Not more than 500 words"
              ></textarea>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">
              Product will be avialable from:
            </label>
            <input
              type="date"
              id="availableFrom"
              value={productData.availableFrom}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter date from the product will be available"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
          >
            Submit Product
          </button>
        </form>
      </div>
      {showModal && (
        <Modal
          btn1="Verify"
          btn2="Cancel"
          heading="Verify your account"
          text="You need to verify your account before creating a product. Do you want to verify now?"
          onConfirm={() => {
            setShowModal(false);
            navigate("/dashboard/verify-user");
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
      {
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Product Created Successfully!"
          message={
            "Your product has been created successfully. You can view it in your dashboard."
          }
          navigateTo={"/dashboard/myprofile"}
          navigateLabel={"Go to Dashboard"}
        />
      }
    </div>
  );
}

export default SellProduct;
