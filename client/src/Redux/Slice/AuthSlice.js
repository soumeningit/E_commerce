import { createSlice } from '@reduxjs/toolkit';

const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
    }
};

// Initial state for authentication
const initialAuthState = {
    user: getUserFromStorage(),
    token: localStorage.getItem('token') || null,
    signupData: null,
};

export const AuthSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setSignupData: (state, action) => {
            state.signupData = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        signout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setSignupData, setUser, setToken, signout } = AuthSlice.actions;
export default AuthSlice.reducer;
