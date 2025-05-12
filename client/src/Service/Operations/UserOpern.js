import { USER_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_PRODUCT_DETAILS,
    SUBMIT_CONTACT_US_API
} = USER_API_ENDPOINTS;

export async function getProductDetails(method, data, token) {
    try {
        const response = await apiConnector(method, GET_PRODUCT_DETAILS, null, data, {
            Authorization: `Bearer ${token}`
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function submitContactForm(method, data, token) {
    try {
        const response = await apiConnector(method, SUBMIT_CONTACT_US_API, data, null, {
            Authorization: `Bearer ${token}`
        });
        return response;
    } catch (e) {
        throw e;
    }
}
