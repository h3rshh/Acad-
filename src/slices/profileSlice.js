import { createSlice } from "@reduxjs/toolkit"

// Helper function to safely parse JSON from localStorage
const getStoredUser = () => {
    try {
        const userData = localStorage.getItem("user")
        if (!userData) return null
        return JSON.parse(userData)
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error)
        // Clear invalid data from localStorage
        localStorage.removeItem("user")
        return null
    }
}

const initialState = {
    user: getStoredUser(),
    loading: false,
};

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value){
            state.user = value.payload;
            // Only save to localStorage if value is not null
            if (value.payload) {
                localStorage.setItem("user", JSON.stringify(value.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    }
})

export const { setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;