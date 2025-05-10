import { profileEndpoints } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";
import axios from "axios";
const {
    UPDATE_USER_PROFILE_PIC_API,
    GET_USER_DETAILS_API,
    UPDATE_USER_DETAILS_API,
    VERIFY_USER_API,
    GET_USER_IS_VERIFIED_API
} = profileEndpoints;

export const updateUserProfilePicAPI = async (formData, token) => {
    try {
        const response = await apiConnector(
            "POST", UPDATE_USER_PROFILE_PIC_API,
            formData, null,
            {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const getUserDetailsAPI = async (userId, token) => {
    try {
        const response = await apiConnector(
            "GET", GET_USER_DETAILS_API,
            null, { userId },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const updateUserDetailsAPI = async (userData, token) => {
    try {
        const response = await apiConnector(
            "POST", UPDATE_USER_DETAILS_API,
            userData, null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const verifyUserAPI = async (data, token) => {
    try {
        const response = await axios.post(VERIFY_USER_API, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUserIsVerifiedAPI = async (userId, token) => {
    try {
        const response = await axios.get(GET_USER_IS_VERIFIED_API, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: userId,
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}
