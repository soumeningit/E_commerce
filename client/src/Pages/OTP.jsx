import React, { useState } from "react";
import { useSelector } from "react-redux";
import { sendOTP, signupUser } from "../Service/Operations/AuthOpern";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function OTP() {
  const { signupData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Allow only digits

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    if (value !== "" && index < otp.length - 1) {
      document.getElementById(`input${index + 2}`).focus();
    }

    setOtp(updatedOtp);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`input${index}`).focus();
      }
    }
  };

  const handleSubmit = async () => {
    let otpValue = otp.join("");
    const formData = {
      ...signupData,
      otp: otpValue,
    };
    try {
      signupUser(formData, "POST", navigate);
    } catch (error) {
      console.log("Error while submitting OTP:", error);
    }
  };

  const handleResendOTP = async () => {
    setOtp(["", "", "", ""]);
    document.getElementById("input1").focus();
    try {
      const formData = {
        ...signupData,
        otp: otpValue,
      };
      const response = await sendOTP("POST", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      if (response.data.success) {
        toast.success("OTP ReSent Successfully");
      }
    } catch (error) {
      console.log("Error while resending OTP:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-80 bg-white rounded-xl p-6 space-y-4 shadow-lg relative">
        <div className="text-xl font-bold text-black">Verification Code</div>
        <p className="text-gray-500 text-sm mt-1 text-center">
          We have sent a verification code to your registered email address.
        </p>

        <div className="flex mt-4 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`input${index + 1}`}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 text-center border-b-2 border-gray-300 mx-2 focus:border-blue-500 outline-none text-lg"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-10 py-2 px-4 rounded-lg bg-blue-500 text-white cursor-pointer"
        >
          Verify
        </button>

        <p
          onClick={handleResendOTP}
          className="absolute text-sm text-blue-500 cursor-pointer right-5 bottom-12 hover:underline"
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}

export default OTP;
