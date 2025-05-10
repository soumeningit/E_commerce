import { setToken, setUser } from "../../Redux/Slice/AuthSlice";
import { AUTH_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector"
import { toast } from "react-hot-toast";


const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
    CHANGEPASSWORD_API
} = AUTH_API_ENDPOINTS;

export async function sendOTP(method, data) {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(method, SENDOTP_API, data);
        toast.success("OTP Sent Successfully")
        toast.dismiss(toastId)
        return response;
    } catch (e) {
        toast.dismiss(toastId)
        toast.error(e.message)
        throw e;
    } finally {
        toast.dismiss(toastId)
    }
}
export async function signupUser(data, method, navigate) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, SIGNUP_API, data)
        toast.dismiss(toastId)
        toast.success("Signup Successful");
        navigate("/login");
        return response;
    } catch (e) {
        toast.dismiss(toastId)
        toast.error(e.message)
        throw e;
    } finally {
        toast.dismiss(toastId)
    }
}

export async function loginUser(data, method, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, LOGIN_API, data)
        toast.dismiss(toastId);
        toast.success("Login Successful");
        dispatch(setUser(response?.data?.user_data));
        dispatch(setToken(response?.data?.token));
        navigate("/dashboard/myProfile");
        return response
    }
    catch (e) {
        toast.dismiss(toastId)
        toast.error(e.message)
        throw e;
    } finally {
        toast.dismiss(toastId)
    }
}

export async function forgotPasswordToken(data, method, navigate) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, RESETPASSTOKEN_API, data);
        toast.dismiss(toastId)
        toast.success("Password reset link sent successfully");
        navigate("/login");
        return response;
    } catch (e) {
        toast.dismiss(toastId)
        toast.error(e.message)
        throw e;
    } finally {
        toast.dismiss(toastId)
    }
}

export async function resetPassword(data, method, navigate) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, RESETPASSWORD_API, data)
        toast.dismiss(toastId)
        toast.success("Password reset successfully");
        navigate("/login");
        return response;
    } catch (e) {
        toast.dismiss(toastId)
        toast.error(e.message)
        throw e;
    } finally {
        toast.dismiss(toastId)
    }
}