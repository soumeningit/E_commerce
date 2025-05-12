import toast from "react-hot-toast";
import { CATEGORY_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_CATEGORIES_API,
    CREATE_CATEGORY_API,
    UPDATE_CATEGORY_API,
    DELETE_CATEGORY_API,
    GET_ALL_CATEGORY_API,
    GET_ITEMS_BY_CATEGORY_API,
    GET_ITEMS_BY_CATEGORY_NAME_API
} = CATEGORY_API_ENDPOINTS;

export async function getCategoriesAPI(method, token) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, GET_CATEGORIES_API, {
            Authorization: `Bearer ${token}`,
        });
        toast.dismiss(toastId);
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        throw e;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function createCategory(data, method) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, CREATE_CATEGORY_API, data);
        toast.dismiss(toastId);
        toast.success("Category Created Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        throw e;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function getAllCategory(method) {
    try {
        const response = await apiConnector(method, GET_ALL_CATEGORY_API);
        return response;
    } catch (e) {
        throw e;
    }
}

export async function findItemsByCategory(method, id) {
    try {
        const response = await apiConnector(method, GET_ITEMS_BY_CATEGORY_API, null, { id: id });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    } catch (error) {
        throw error;
    }
}

export async function findItemsByCategoryName(method, name) {
    try {
        const response = await apiConnector(method, GET_ITEMS_BY_CATEGORY_NAME_API, null, { categoryName: name });
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    } catch (error) {
        throw error;
    }
}