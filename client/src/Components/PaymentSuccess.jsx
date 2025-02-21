import React from "react";

function PaymentSuccess({
  customerName,
  paymentId,
  orderId,
  amount,
  companyName,
  year,
}) {
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
          <p>
            <span className="font-semibold">Amount:</span> ${amount}
          </p>
        </div>

        <p className="mt-4">
          If you have any questions, feel free to contact our support team.
        </p>
        <p className="mt-4">Best regards,</p>
        <p className="font-semibold">{companyName}</p>
      </div>
      <div className="bg-gray-100 text-center text-gray-600 py-3 text-sm">
        &copy; {year} {companyName}. All rights reserved.
      </div>
    </div>
  );
}

export default PaymentSuccess;
