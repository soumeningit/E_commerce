import React from "react";
import { useState } from "react";
import { forgotPasswordToken } from "../Service/Operations/AuthOpern";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(email);
    try {
      forgotPasswordToken({ email }, "POST", navigate);
    } catch (error) {
      console.log("Error in forget Password:", error);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center mt-2 max-w-[800px] mx-auto gap-y-4 border-none">
        <form
          onSubmit={handleSubmit}
          className="w-[100%] p-20 border border-gray-300 shadow-lg m-0 space-y-6"
        >
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-bold">Forget Password</h1>
            <p className="text-sm font-semibold font-serif text-gray-500">
              Enter your registered email to reset your password
            </p>
            <label htmlFor="email" className="text-start">
              Email
            </label>{" "}
            <br />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-300  border-b-blue-300 focus:border-blue-400 w-[95%] p-2 rounded-md outline-none"
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-500 focus:ring-2
                            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mt-2 mb-2 ml-4
                            dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default ForgetPassword;
