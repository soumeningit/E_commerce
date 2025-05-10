import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getUserIsVerifiedAPI,
  verifyUserAPI,
} from "../Service/Operations/ProfileAPI";
import VerifiedModal from "../Components/VerifiedModal";

function VerifyUser() {
  const [data, setData] = useState({
    email: "",
    id_card_number: "",
    card_type: "",
    card_image: null,
    date_of_birth: "",
    is_adult: "",
  });

  const [isUserVerified, setIsUserVerified] = useState(false);

  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  const { user, token } = useSelector((state) => state.auth);
  const user_id = user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    // Automatically set is_adult when DOB is selected
    if (data.date_of_birth) {
      const today = new Date();
      const birthDate = new Date(data.date_of_birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      setData((prev) => ({
        ...prev,
        is_adult: age >= 18 ? "yes" : "no",
      }));
    }
  }, [data.date_of_birth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user_id) {
      alert("User not logged in. Please log in to verify.");
      return;
    }

    if (data.is_adult !== "yes") {
      alert("You must be at least 18 years old to verify your identity.");
      return;
    }

    const formData = new FormData();
    formData.append("id_card_number", data.id_card_number);
    formData.append("card_type", data.card_type);
    formData.append("card_image", data.card_image);
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("is_adult", data.is_adult);
    formData.append("user_id", user_id);
    formData.append("email", data.email);

    const toastId = toast.loading("Verifying user identity...");
    try {
      const response = await verifyUserAPI(formData, token);
      toast.dismiss(toastId);
      if (response.status === 200) {
        setShowVerifiedModal(true);
        setData({
          id_card_number: "",
          card_type: "",
          card_image: null,
          date_of_birth: "",
          is_adult: "",
        });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Verification failed. Please try again.");
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setData((prev) => ({ ...prev, card_image: acceptedFiles[0] }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const checkIsUserVerified = async () => {
    try {
      const response = await getUserIsVerifiedAPI(user.id, token);
      if (response.status === 201) {
        setIsUserVerified(true);
      }
      if (response.status === 200) {
        setIsUserVerified(false);
      }
    } catch (error) {
      console.error("Error : ", error);
    }
  };

  useEffect(() => {
    checkIsUserVerified();
  }, []);

  return (
    <>
      {isUserVerified ? (
        <div>
          <VerifiedModal
            bt1="Cancel"
            bt2="Go To Dashboard"
            title="Already Verified"
            message="You have already verified your identity. Thank you for your cooperation."
            onClick={() => navigate("/dashboard/myprofile")}
            onClose={() => setIsUserVerified(false)}
          />
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-indigo-600 text-center mb-8">
              Verify User Identity
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-1">
                  Registered Mail Address
                </label>
                <input
                  type="text"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your Registered email address"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  ID Card Number
                </label>
                <input
                  type="text"
                  value={data.id_card_number}
                  onChange={(e) =>
                    setData({ ...data, id_card_number: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your ID number (Aadhar, PAN, etc.)"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Card Type</label>
                <select
                  value={data.card_type}
                  onChange={(e) =>
                    setData({ ...data, card_type: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">Pan Card</option>
                  <option value="voter">Voter Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Card Image</label>
                <div
                  {...getRootProps()}
                  className="w-full border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50 text-center cursor-pointer hover:border-indigo-500"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-indigo-500">Drop the image here...</p>
                  ) : data.card_image ? (
                    <p className="text-gray-600">{data.card_image.name}</p>
                  ) : (
                    <p className="text-gray-400">
                      Drag & drop card image or click to select
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={data.date_of_birth}
                  onChange={(e) =>
                    setData({ ...data, date_of_birth: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
              >
                Submit Verification
              </button>
            </form>
          </div>
          {showVerifiedModal && (
            <VerifiedModal
              bt1="Cancel"
              bt2="Go To Dashboard"
              title="Successfully Submitted"
              message="Your verification request has been submitted. Please wait for approval."
              onClick={() => navigate("/dashboard/myprofile")}
              onClose={() => setShowVerifiedModal(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default VerifyUser;
