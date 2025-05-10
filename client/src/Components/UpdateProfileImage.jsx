import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { updateUserProfilePicAPI } from "../Service/Operations/ProfileAPI";

function UpdateProfileImage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { user, token } = useSelector((state) => state.auth);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("userId", user.id);

      const toastId = toast.loading("Uploading image...");
      try {
        const response = await updateUserProfilePicAPI(formData, token);
        toast.dismiss(toastId);
        if (response.status === 200) {
          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Error uploading image. Please try again.");
        setSelectedImage(null);
        setPreviewUrl(null);
        console.error("Error uploading image:", error);
      } finally {
        toast.dismiss(toastId);
        setSelectedImage(null);
        setPreviewUrl(null);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
      <div className="space-y-4">
        {previewUrl && (
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg transform transition-all duration-300 group-hover:scale-105"
            />
            <button
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <RiDeleteBin6Line size={20} />
            </button>
          </div>
        )}

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              transition-all duration-200"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedImage}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold
            ${
              selectedImage
                ? "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }
            transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer`}
        >
          <span>Upload Image</span>
          <svg
            className={`w-5 h-5 ${selectedImage ? "animate-pulse" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.22 6M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default UpdateProfileImage;
