import { ORDER_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_ALL_ORDERS_FOR_USER_API,
    GET_ORDER_DETAILS_API,
    SUBMIT_REVIEW_API
} = ORDER_API_ENDPOINTS;

export const getAllOrdersForUserAPI = async (method, data, token) => {
    try {
        const response = await apiConnector(method, GET_ALL_ORDERS_FOR_USER_API, null, data, {
            Authorization: `Bearer ${token}`
        }
        );
        return response;
    } catch (e) {
        throw e;
    }
}

export const getOrderDetailsAPI = async (method, data, token) => {
    try {
        const response = await apiConnector(method, GET_ORDER_DETAILS_API, null, data, {
            Authorization: `Bearer ${token}`
        }
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const submitReviewAPI = async (method, data, token) => {
    try {
        const response = await apiConnector(method, SUBMIT_REVIEW_API, data, null, {
            Authorization: `Bearer ${token}`
        }
        );
        return response;
    } catch (error) {
        throw error;
    }
}