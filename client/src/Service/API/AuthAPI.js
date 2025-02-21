const BASE_URL = "http://localhost:4000/api";

export const AUTH_API_ENDPOINTS = {
    SENDOTP_API: BASE_URL + "/auth/sendOTP",
    SIGNUP_API: BASE_URL + "/auth/signUp",
    LOGIN_API: BASE_URL + "/auth/login",
    LOGOUT_API: BASE_URL + "/auth/logout",
    RESETPASSTOKEN_API: BASE_URL + "/auth/forgot-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    CHANGEPASSWORD_API: BASE_URL + "/auth/update-password",
}