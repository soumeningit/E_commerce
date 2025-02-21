import toast from "react-hot-toast";
import { PRODUCT_API_ENDPOINTS } from "../API/ProductAPI";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_PRODUCTS_API,
    CREATE_PRODUCT_API,
    SEARCH_PRODUCT_API,
    UPDATE_PRODUCT_API,
    DELETE_PRODUCT_API,
    GET_PRODUCT_API
} = PRODUCT_API_ENDPOINTS;

export const getProducts = async () => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("GET", GET_PRODUCTS_API);
        console.log("GET PRODUCTS API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("GET PRODUCTS API ERROR : ", e);
    } finally {
        toast.dismiss(toastId);
    }
}

export const createProduct = async (method, data, token) => {
    const toastId = toast.loading("Loading...");
    console.log("CREATE PRODUCT API DATA : ", data, method, token);

    try {
        const response = await apiConnector(method, CREATE_PRODUCT_API, data, null, {
            contentType: "multipart/form-data",
            Authorization: `Bearer ${token}`
        });
        console.log("CREATE PRODUCT API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success("Product Created Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("CREATE PRODUCT API ERROR : ", e);
        toast.error(e.message);
    } finally {
        toast.dismiss(toastId);
    }
}

export const searchProduct = async (method, data) => {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, SEARCH_PRODUCT_API, data);
        console.log("SEARCH PRODUCT API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("SEARCH PRODUCT API ERROR : ", e);
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
        console.log("UPDATE PRODUCT API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success("Product Updated Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("UPDATE PRODUCT API ERROR : ", e);
        toast.error(e.message);
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
        console.log("DELETE PRODUCT API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success("Product Deleted Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("DELETE PRODUCT API ERROR : ", e);
        toast.error(e.message);
    } finally {
        toast.dismiss(toastId);
    }
}
