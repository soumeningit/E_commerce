const BASE_URL = 'http://localhost:4000/api';

export const PAYMENT_API_ENDPOINTS = {
    PAYMENT_INITIATE_API: `${BASE_URL}/payment/capture-payment`,
    PAYMENT_SUCCESS_EMAIL_API: `${BASE_URL}/payment/payment-success-email`,
    VERIFY_PAYMENT_API: `${BASE_URL}/payment/verify-payment`
}