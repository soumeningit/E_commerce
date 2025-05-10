import toast from "react-hot-toast";
import { PRODUCT_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_PRODUCTS_API,
    CREATE_PRODUCT_API,
    SEARCH_PRODUCT_API,
    UPDATE_PRODUCT_API,
    DELETE_PRODUCT_API,
    GET_PRODUCT_BY_ID_API,
    GET_PRODUCT_DETAILS_BY_ID_API,
    GET_PRODUCT_REVIEWS_API
} = PRODUCT_API_ENDPOINTS;

export const getProducts = async () => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("GET", GET_PRODUCTS_API);
        toast.dismiss(toastId);
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        throw e;
    } finally {
        toast.dismiss(toastId);
    }
}

export const createProductAPI = async (method, data, token) => {

    try {
        const response = await apiConnector(method, CREATE_PRODUCT_API, data, null, {
            contentType: "multipart/form-data",
            Authorization: `Bearer ${token}`
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export const searchProduct = async (method, data) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, SEARCH_PRODUCT_API, null, data);
        toast.dismiss(toastId);
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        throw e;
    } finally {
        toast.dismiss(toastId);
    }
}

export const updateProduct = async (method, data, token) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, UPDATE_PRODUCT_API, data, {
            Authorization: `Bearer ${token}`
        });
        toast.dismiss(toastId);
        toast.success("Product Updated Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        toast.error(e.message);
        throw e;
    } finally {
        toast.dismiss(toastId);
    }
}

export const deleteProduct = async (method, data, token) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, DELETE_PRODUCT_API, data, {
            Authorization: `Bearer ${token}`
        });
        toast.dismiss(toastId);
        toast.success("Product Deleted Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        toast.error(e.message);
        throw e;
    } finally {
        toast.dismiss(toastId);
    }
}

export const getProductByIdAPI = async (method, data, token) => {
    try {
        const response = await apiConnector(method, GET_PRODUCT_BY_ID_API, null, data, {
            Authorization: `Bearer ${token}`
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export const deleteProductByIdAPI = async (method, data, token) => {
    try {
        const response = await apiConnector(method, DELETE_PRODUCT_API, null, data, {
            Authorization: `Bearer ${token}`
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export const getProductDetailsAPI = async (method, data) => {
    try {
        const response = await apiConnector(method, GET_PRODUCT_DETAILS_BY_ID_API, null, data);
        return response;
    } catch (e) {
        throw e;
    }
}

export const getProductReviewsAPI = async (method, data) => {
    try {
        const response = await apiConnector(method, GET_PRODUCT_REVIEWS_API, null, data);
        return response;
    } catch (e) {
        throw e;
    }
}
