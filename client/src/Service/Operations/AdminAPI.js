import toast from "react-hot-toast";
import { apiConnector } from "./Connector/apiConnector"
import { ADMIN_API_ENDPOINTS } from "../APIS";

const {
    ALL_USERS_API,
    BLOCK_USER_API,
    ALL_BLOCKED_USERS_API,
    UNBLOCK_USER_API,
    VERIFY_USER_API,
    GET_PENDING_USERS_API
} = ADMIN_API_ENDPOINTS;

export const allUsersAdminAPI = async (token, method) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, ALL_USERS_API, null, null, {
            Authorization: `Bearer ${token}`
        });
        toast.dismiss(toastId)
        return response;
    } catch (e) {
        toast.dismiss(toastId)
        toast.error(e.response.data.message)
        throw e;
    } finally {
        toast.dismiss(toastId)
    }
}

export const getAllBlockedUsersAPI = async (token, method) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, ALL_BLOCKED_USERS_API, null, null, {
            Authorization: `Bearer ${token}`
        })
        toast.dismiss(toastId)
        return response;
    } catch (e) {
        toast.dismiss(toastId)
        toast.error(e.response.data.message)
        throw e;
    } finally {
        toast.dismiss(toastId)
    }
}

export const blockUserAdminAPI = async (token, method, userId) => {

    try {
        const response = await apiConnector(method, `${BLOCK_USER_API}/${userId}`, null, null, {
            Authorization: `Bearer ${token} `
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        return response;
    } catch (e) {
        toast.error(e.response.data.message);
        throw e;
    }
}

export const unBlockUserAdminAPI = async (token, method, userId) => {

    try {
        const response = await apiConnector(method, `${UNBLOCK_USER_API}/${userId}`, null, null, {
            Authorization: `Bearer ${token} `
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        return response;
    } catch (e) {
        toast.error(e.response.data.message);
        throw e;
    }
}

export const getPendingUsersAPI = async (token, method) => {
    try {
        const response = await apiConnector(method, GET_PENDING_USERS_API, null, null, {
            Authorization: `Bearer ${token}`
        })
        return response;
    } catch (e) {
        toast.error(e.response.data.message)
        throw e;
    }
}

export const verifyUserAPI = async (token, method, data) => {
    try {
        const response = await apiConnector(method, VERIFY_USER_API, data, null, {
            Authorization: `Bearer ${token}`
        })
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        return response;
    } catch (e) {
        toast.error(e.response.data.message);
        throw e;
    }
}
