import { createSlice } from "@reduxjs/toolkit"

// Helper function to safely parse JSON from localStorage
const getStoredToken = () => {
    try {
        const tokenData = localStorage.getItem("token")
        if (!tokenData) return null
        return JSON.parse(tokenData)
    } catch (error) {
        console.error("Error parsing token data from localStorage:", error)
        // Clear invalid data from localStorage
        localStorage.removeItem("token")
        return null
    }
}

const initialState = {
    token: getStoredToken(),
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken(state, value){
            state.token = value.payload;
            // Only save to localStorage if value is not null
            if (value.payload) {
                localStorage.setItem("token", JSON.stringify(value.payload));
            } else {
                localStorage.removeItem("token");
            }
        },
        setLoading(state, value){
            state.loading = value.payload;
        },
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
    }
})

export const { setToken, setLoading, setSignupData} = authSlice.actions;
export default authSlice.reducer;