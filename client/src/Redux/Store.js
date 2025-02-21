import { configureStore } from '@reduxjs/toolkit'
import CartSlice from './Slice/CartSlice';
import AuthSlice from './Slice/AuthSlice';
import ProductSlice from './Slice/ProductSlice';

export const store = configureStore({
    reducer: {
        cart: CartSlice,
        auth: AuthSlice,
        product: ProductSlice,
        cart: CartSlice
    }
});