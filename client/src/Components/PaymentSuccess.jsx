import React from "react";
import { useNavigate } from "react-router-dom";
import { LuIndianRupee } from "react-icons/lu";

function PaymentSuccess({
  customerName,
  paymentId,
  orderId,
  amount,
  companyName,
  year,
}) {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-green-500 text-white text-center py-4">
        <h1 className="text-2xl font-semibold">Payment Successful</h1>
      </div>
      <div className="p-6 text-gray-700">
        <p className="text-lg">
          Dear <span className="font-semibold">{customerName}</span>,
        </p>
        <p className="mt-2">
          Thank you for your payment. Your transaction has been successfully
          completed.
        </p>

        <div className="mt-4 space-y-2">
          <p>
            <span className="font-semibold">Payment ID:</span> {paymentId}
          </p>
          <p>
            <span className="font-semibold">Order ID:</span> {orderId}
          </p>
          <p className="flex space-x-2">
            <span className="font-semibold">Amount:</span>
            <span className="flex space-x-2">
              <LuIndianRupee className="mt-1.5" />
              {amount}
            </span>
          </p>
        </div>

        <p className="mt-4">
          If you have any questions, feel free to contact our support team.
        </p>
        <p className="mt-4">Best regards,</p>
        <p className="font-semibold">{companyName}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 cursor-pointer
          "
        >
          Go to Home
        </button>
      </div>
      <div className="bg-gray-100 text-center text-gray-600 py-3 text-sm">
        &copy; {year} {companyName}. All rights reserved.
      </div>
    </div>
  );
}

export default PaymentSuccess;
