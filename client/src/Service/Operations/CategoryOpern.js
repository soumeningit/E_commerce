import toast from "react-hot-toast";
import { CATEGORY_API_ENDPOINTS } from "../API/CategoryAPI";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_CATEGORIES_API,
    CREATE_CATEGORY_API,
    UPDATE_CATEGORY_API,
    DELETE_CATEGORY_API,
    GET_ALL_CATEGORY_API,
    GET_ITEMS_BY_CATEGORY_API
} = CATEGORY_API_ENDPOINTS;

export async function getCategories(method, token) {
    console.log("token : " + token);
    console.log("GET_CATEGORIES_API : " + GET_CATEGORIES_API);
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, GET_CATEGORIES_API, {
            Authorization: `Bearer ${token}`,
        });
        console.log("GET CATEGORIES API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("GET CATEGORIES API ERROR : ", e);
    } finally {
        toast.dismiss(toastId);
    }
}

export async function createCategory(data, method) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, CREATE_CATEGORY_API, data);
        console.log("CREATE CATEGORY API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success("Category Created Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("CREATE CATEGORY API ERROR : ", e);
    } finally {
        toast.dismiss(toastId);
    }
}

export async function getAllCategory(method) {
    try {
        const response = await apiConnector(method, GET_ALL_CATEGORY_API);
        console.log("GET CATEGORIES API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    } catch (e) {
        console.log("GET CATEGORIES API ERROR : ", e);
    }
}

export async function findItemsByCategory(method, id) {
    console.log("ID : ", id, "METHOD : ", method);
    try {
        const response = await apiConnector(method, GET_ITEMS_BY_CATEGORY_API, null, { id: id });
        // console.log("Response : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    } catch (error) {
        console.log("Error in findItemsByCategory : ", error);
    }
}