import { USER_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_PRODUCT_DETAILS,
    // GET_USER_DETAILS_API
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
