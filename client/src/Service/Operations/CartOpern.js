import toast from "react-hot-toast";
import { CART_API_ENDPOINTS } from "../API/CartAPI";
import { apiConnector } from "./Connector/apiConnector";

const {
    GET_CART_ITEMS_API,
    ADD_ITEMS_TO_CART_API,
    UPDATE_CART_ITEMS_API,
    DELETE_ITEMS_FROM_CART_API
} = CART_API_ENDPOINTS;

export async function getCartItems(method, token, data) {
    console.log("token : " + token);
    console.log("GET_CART_ITEMS_API : " + GET_CART_ITEMS_API);
    console.log("GET CART ITEMS API DATA : ", data);
    try {
        const response = await apiConnector(method, GET_CART_ITEMS_API, null, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("GET CART ITEMS API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    } catch (e) {
        console.log("GET CART ITEMS API ERROR : ", e);
    }
}

export async function addItemsToCart(method, data, token) {
    console.log("ADD ITEMS TO CART API DATA : ", data, method, token);
    try {
        const response = await apiConnector(method, ADD_ITEMS_TO_CART_API, data, null, {
            Authorization: `Bearer ${token}`
        });
        console.log("ADD ITEMS TO CART API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response;
    } catch (e) {
        console.log("ADD ITEMS TO CART API ERROR : ", e);
    }
}

export async function updateCartItems(data, method, token) {
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, UPDATE_CART_ITEMS_API, data, {
            Authorization: `Bearer ${token}`
        });
        console.log("UPDATE CART ITEMS API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success("Cart Updated Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("UPDATE CART ITEMS API ERROR : ", e);
    } finally {
        toast.dismiss(toastId);
    }
}

export async function deleteItemsFromCart(method, data, token) {
    console.log("DELETE ITEMS FROM CART API DATA : ", data, method, token);
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(method, DELETE_ITEMS_FROM_CART_API, data, null, {
            Authorization: `Bearer ${token}`
        });
        console.log("DELETE ITEMS FROM CART API RESPONSE : ", response);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.dismiss(toastId);
        toast.success("Items Deleted from Cart Successfully");
        return response;
    } catch (e) {
        toast.dismiss(toastId);
        console.log("DELETE ITEMS FROM CART API ERROR : ", e);
    } finally {
        toast.dismiss(toastId);
    }
}