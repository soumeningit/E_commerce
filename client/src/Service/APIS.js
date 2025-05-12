const BASE_URL = process.env.NODE_ENV === "production" ?
    "https://ecombackend-0ku8.onrender.com/api" :
    "http://localhost:4000/api";


export const AUTH_API_ENDPOINTS = {
    SENDOTP_API: BASE_URL + "/auth/sendOTP",
    SIGNUP_API: BASE_URL + "/auth/signUp",
    LOGIN_API: BASE_URL + "/auth/login",
    LOGOUT_API: BASE_URL + "/auth/logout",
    RESETPASSTOKEN_API: BASE_URL + "/auth/forgot-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    CHANGEPASSWORD_API: BASE_URL + "/auth/update-password",
}

export const CART_API_ENDPOINTS = {
    GET_CART_ITEMS_API: BASE_URL + "/cart/get-cart-items",
    ADD_ITEMS_TO_CART_API: BASE_URL + "/cart/add-items-to-cart",
    UPDATE_CART_ITEMS_API: BASE_URL + "/cart/update-cart-items",
    DELETE_ITEMS_FROM_CART_API: BASE_URL + "/cart/delete-items-from-cart"
}

export const CATEGORY_API_ENDPOINTS = {
    GET_CATEGORIES_API: BASE_URL + "/category/get-categories",
    CREATE_CATEGORY_API: BASE_URL + "/category/create-category",
    UPDATE_CATEGORY_API: BASE_URL + "/category",
    DELETE_CATEGORY_API: BASE_URL + "/category",
    GET_ALL_CATEGORY_API: BASE_URL + "/category/get-categories",
    GET_ITEMS_BY_CATEGORY_API: BASE_URL + "/category/get-products-by-category",
    GET_ITEMS_BY_CATEGORY_NAME_API: BASE_URL + "/category/get-products-by-category-name",
}

export const PAYMENT_API_ENDPOINTS = {
    PAYMENT_INITIATE_API: `${BASE_URL}/payment/capture-payment`,
    PAYMENT_SUCCESS_EMAIL_API: `${BASE_URL}/payment/payment-success-email`,
    VERIFY_PAYMENT_API: `${BASE_URL}/payment/verify-payment`
}

export const PRODUCT_API_ENDPOINTS = {
    GET_PRODUCTS_API: BASE_URL + "/product/get-all-product",
    CREATE_PRODUCT_API: BASE_URL + "/product/create-product",
    SEARCH_PRODUCT_API: BASE_URL + "/product/search-item",
    UPDATE_PRODUCT_API: BASE_URL + "/product",
    DELETE_PRODUCT_API: BASE_URL + "/product",
    GET_PRODUCT_API: BASE_URL + "/product",
    GET_PRODUCT_BY_ID_API: BASE_URL + "/product/get-product-by-id",
    GET_PRODUCT_DETAILS_BY_ID_API: BASE_URL + "/product/get-product-details-by-id",
    GET_PRODUCT_REVIEWS_API: BASE_URL + "/product/get-reviews",
}

export const USER_API_ENDPOINTS = {
    GET_PRODUCT_DETAILS: BASE_URL + '/user/getProductsDetails',
    SUBMIT_CONTACT_US_API: BASE_URL + "/user/submit-contact-us-data",
}

export const ADMIN_API_ENDPOINTS = {
    ALL_USERS_API: BASE_URL + "/admin/get-all-users",
    ALL_BLOCKED_USERS_API: BASE_URL + "/admin/get-all-blocked-users",
    BLOCK_USER_API: BASE_URL + "/admin/block-user",
    UNBLOCK_USER_API: BASE_URL + "/admin/unblock-user",
    VERIFY_USER_API: BASE_URL + "/admin/verify-user",
    GET_PENDING_USERS_API: BASE_URL + "/admin/get-all-notverified-user",
}

export const profileEndpoints = {
    GET_USER_DETAILS_API: BASE_URL + "/profile/get-user-profile-details",
    UPDATE_USER_DETAILS_API: BASE_URL + "/profile/update-user-details",
    UPDATE_USER_PROFILE_PIC_API: BASE_URL + "/profile/update-user-image",
    GET_USER_IS_VERIFIED_API: BASE_URL + "/general/check-user-verified",
    GET_ALL_PRODUCTS_USER_API: BASE_URL + "/user/get-product-details-for-particular-user",
    VERIFY_USER_API: BASE_URL + "/profile/verify-user",
    GET_USER_IS_VERIFIED_API: BASE_URL + "/profile/get-user-is-verified"
};

export const ORDER_API_ENDPOINTS = {
    GET_ALL_ORDERS_FOR_USER_API: BASE_URL + "/order/get-order-details",
    GET_ORDER_DETAILS_API: BASE_URL + "/order/get-order-details-by-id",
    SUBMIT_REVIEW_API: BASE_URL + "/order/add-review",
}
