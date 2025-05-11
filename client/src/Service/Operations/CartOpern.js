import toast from "react-hot-toast";
import { CART_API_ENDPOINTS } from "../APIS";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_CART_ITEMS_API,
    ADD_ITEMS_TO_CART_API,
    UPDATE_CART_ITEMS_API,
    DELETE_ITEMS_FROM_CART_API
} = CART_API_ENDPOINTS;

export async function getCartItems(method, token, data) {
    try {
        const response = await apiConnector(method, GET_CART_ITEMS_API, null, data, {
            Authorization: `Bearer ${token}`,
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function addItemsToCart(method, data, token) {
    try {
        const response = await apiConnector(method, ADD_ITEMS_TO_CART_API, data, null, {
            Authorization: `Bearer ${token}`
        });
        return response;
    } catch (e) {
        throw e;
    }
}

export async function updateCartItems(data, method, token) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, UPDATE_CART_ITEMS_API, data, {
            Authorization: `Bearer ${token}`
        });
        toast.dismiss(toastId);
        toast.success("Cart Updated Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        throw e;
    } finally {
        toast.dismiss(toastId);
    }
}

export async function deleteItemsFromCart(method, data, token) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, DELETE_ITEMS_FROM_CART_API, data, null, {
            Authorization: `Bearer ${token}`
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