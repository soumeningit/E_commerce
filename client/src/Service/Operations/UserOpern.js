import { USER_API_ENDPOINTS } from "../API/UserAPI";
import { apiConnector } from "./Connector/apiConnector";

const { GET_PRODUCT_DETAILS } = USER_API_ENDPOINTS;

export async function getProductDetails(method, data, token) {
    console.log("GET PRODUCT DETAILS API DATA : ", method, data, token);
    try {
        const response = await apiConnector(method, GET_PRODUCT_DETAILS, null, data, {
            Authorization: `Bearer ${token}`
        });
        console.log("GET PRODUCT DETAILS API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    } catch (e) {
        console.log("GET PRODUCT DETAILS API ERROR : ", e);
        throw e;
    }
}