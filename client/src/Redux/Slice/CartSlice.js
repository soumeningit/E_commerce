import { createSlice } from "@reduxjs/toolkit";

const initialCartState = {
    cart: [],
    price: 0,
    priceData: null
}

export const CartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push(action.payload);
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload.id);
        },
        updatePrice: (state) => {
            state.price = state.price + action.payload;
        },
        addProduct: (state, action) => {
            state.cart.push(action.payload);
        },
        removeProduct: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload.id);
        },
        setPriceData: (state, action) => {
            state.priceData = action.payload;
        }
    }
});

export const { addToCart, removeFromCart, updatePrice, addProduct, removeProduct, setPriceData } = CartSlice.actions;
export default CartSlice.reducer;