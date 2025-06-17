import toast from "react-hot-toast"; 
import {setLoading, setToken} from "../../slices/authSlice";
import {resetCart} from "../../slices/cartSlice";
import {setUser} from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endPoints } from "../apis";

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASS_API
} = endPoints

export function sendOtp(email, navigate){
    return async(dispatch) => {
        console.log("Entered sendotp")
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
        try{
            const res = await apiConnector("POST", SENDOTP_API, {email, checkUserPresent: true})
            if(!res.data.success){
                toast.error("Couldnt Send OTP")
                throw new Error(res.data.message)
            }
            toast.success("OTP Sent Succesfully")
            navigate('/verify-email')
        }
        catch(error){
            console.log("Error send otp serv/opns")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const res = await apiConnector("POST", LOGIN_API, {email, password})
            console.log("LOGIN Response : ", res);
            if(!res.data.success){
                toast.error("Login Failed !!")
                throw new Error(res.data.message)
            }
            dispatch(setToken(res.data.token))
            const userImage = res.data?.user?.image ? res.data.user.image 
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
            dispatch(setUser({ ...res.data.user, image: userImage }))
            console.log("Check 1")
            localStorage.setItem("token", JSON.stringify(res.data.token))
            localStorage.setItem("user", JSON.stringify(res.data.user))
            console.log("Check 2")
            navigate('/dashboard')
            toast.success("Logged In")
        }
        catch(error){
            console.log("Error logging in, in services/ops/authAPI")
        }
        dispatch(setLoading(false))
    }
}

export function signUp(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    otp,
    navigate
  ) {
    return async (dispatch) => {
        // console.log("Data in services signup: ")
        // console.log("Firstname : ", firstName)
        // console.log("LastName  : ", lastName)
        // console.log("Email : ", email)
        // console.log("password : ", password)
        // console.log("confirmpassowrd : ", confirmPassword)
        // console.log("otp : ", otp)
        // console.log("Acc type : ", accountType)
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", SIGNUP_API, {
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
        })
        console.log("Data : ", firstName, " ", lastName, " ", email, " ", password, " ", confirmPassword, " ", otp)
        console.log("SIGNUP API RESPONSE............", response)
  
        dispatch(setLoading(false))
        toast.success("Signup Successful")
        navigate("/login")
      } 
      catch (error) {
        console.log("SIGNUP API ERROR............", error);
        if (error.response) {
          console.log("Error Response Data:", error.response.data);
          console.log("Error Response Status:", error.response.status);
          console.log("Error Response Headers:", error.response.headers);
        }
        dispatch(setLoading(false))
        navigate("/signup");
      }

    }
}

export function getPasswordResetToken(email, setEmailSent){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            console.log("Entered call to get password reset token")
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {email});
            console.log("RESET PASS TOKEN FETCHED : ", response);
            if(!response.data.success){
                toast.error("Failed to Send Password Reset Mail !!");
                console.log("RESET PASS TOKEN FAILURE : ", response)
                throw new Error(response.data.message)
            }

            toast.success("Reset Email Sent");
            setEmailSent(true);
        }
        catch(error){
            console.log("Failed at get password token in /services/operations/authAPI")
        }
        dispatch(setLoading(false));
    }
}

export function resetPass(password, confirmPassword, token){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", RESETPASS_API, {password, confirmPassword, token});
            console.log("Reset Password : ", response)
            if(!response.data.success) {
                throw new Error(response.data.message);
            }
            toast.success("Password has been reset successfully");
        }
        catch(error){
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Unable to reset password");
        }
        dispatch(setLoading(false))
    }
}

export function logout(navigate){
    return (dispatch) => {
        dispatch(setUser(null))
        dispatch(setToken(null))
        dispatch(resetCart())
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}