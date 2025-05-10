import React from "react";
import PaymentSuccess from "../Components/PaymentSuccess";
import { useLocation } from "react-router-dom";

function PaymentSuccessPage() {
  const location = useLocation();

  console.log(location);

  console.log("location : " + JSON.stringify(location));

  const { data } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PaymentSuccess
        customerName={data?.name || "NA"}
        paymentId={data?.paymentId}
        orderId={data?.orderId}
        amount={data?.amount}
        companyName="ECommerce Inc."
        year={new Date().getFullYear()}
      />
    </div>
  );
}

export default PaymentSuccessPage;
