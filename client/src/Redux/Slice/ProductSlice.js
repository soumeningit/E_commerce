import { createSlice } from "@reduxjs/toolkit";

const initialProductState = {
    product: null
}

export const ItemSlice = createSlice({
    name: 'product',
    initialState: initialProductState,
    reducers: {
        setProducts: (state, action) => {
            state.product = action.payload;
        }
    }
});
export const { setProducts } = ItemSlice.actions;
export default ItemSlice.reducer;