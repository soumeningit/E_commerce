import toast from "react-hot-toast";
import { PAYMENT_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";

const {
    PAYMENT_INITIATE_API,
    PAYMENT_SUCCESS_EMAIL_API,
    VERIFY_PAYMENT_API
} = PAYMENT_API_ENDPOINTS;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

export const initiatePayment = async (method, data, token, navigate, dispatch) => {
    const toastId = toast.loading("Processing Payment...");
    try {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (!res) {
            alert('Razropay failed to load!!')
            return
        }

        const paymentResponse = await apiConnector(method, PAYMENT_INITIATE_API, data, null, {
            Authorization: `Bearer ${token}`
        });
        if (!paymentResponse.data.success) {
            throw new Error(paymentResponse.data.message);
        }

        const options = {
            key: paymentResponse.data.keyId, // Enter the Key ID generated from the Dashboard
            amount: `${paymentResponse.data.data.amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "E-Commerace",
            description: "Happy Shopping",
            image: "https://example.com/your_logo",
            order_id: `${paymentResponse.data.data.id}`,
            prefill: {
                name: paymentResponse.data.name,
                email: paymentResponse.data.email,
            },
            handler: function (response) {
                sendPaymentSuccess({ ...response, ...data }, paymentResponse.data.data.amount, token)
                // verify payment
                verifyPayment({
                    ...response,
                    email: paymentResponse.data.email,
                    name: paymentResponse.data.name,
                    amount: paymentResponse.data.amount,
                    order_id: paymentResponse.data.order_id,
                    payment_id: paymentResponse.data.order_id,
                    userId: data.userId,
                }, token, navigate, dispatch)
            },
        }
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        toast.dismiss(toastId);
        toast.success("Payment Initiated Successfully");
        return paymentResponse;
    } catch (error) {
        toast.dismiss(toastId);
        console.log("Error in initiatePayment: ", error);
    } finally {
        toast.dismiss(toastId);
    }
};

export const sendPaymentSuccess = async (response, amount, token) => {
    try {
        const data = {
            response,
            amount
        }
        const res = await apiConnector('POST', PAYMENT_SUCCESS_EMAIL_API, data, null, {
            Authorization: `Bearer ${token}`
        });
        if (!res.data.success) {
            throw new Error(res.data.message);
        }
    } catch (error) {
        console.log("Error in sendPaymentSuccess: ", error);
    }
}

export const verifyPayment = async (data, token, navigate, dispatch) => {
    try {
        const res = await apiConnector('POST', VERIFY_PAYMENT_API, data, null, {
            Authorization: `Bearer ${token}`
        });
        navigate('/payment-success', {
            state: res?.data
        });
    } catch (error) {
        console.log("Error in verifyPayment: ", error);
    }
}