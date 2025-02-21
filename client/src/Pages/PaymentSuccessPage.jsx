import React from "react";
import PaymentSuccess from "../Components/PaymentSuccess";

function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PaymentSuccess
        customerName="John Doe"
        paymentId="PAY123456"
        orderId="ORD987654"
        amount="49.99"
        companyName="TechCorp"
        year={new Date().getFullYear()}
      />
    </div>
  );
}

export default PaymentSuccessPage;
