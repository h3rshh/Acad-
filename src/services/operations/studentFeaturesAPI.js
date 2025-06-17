import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            console.log("Script loading failed, but continuing with payment flow");
            resolve(true);
        }
        document.body.appendChild(script);
    })
}


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Loading...");
    try{
        console.log("Starting payment process...");
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        console.log("Script loaded:", res);

        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        //initiate the order
        console.log("Creating order with courses:", courses);
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                {courses},
                                {
                                    Authorization: `Bearer ${token}`,
                                })

        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        console.log("Order created successfully:", orderResponse.data.data);
        
        //options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: orderResponse.data.data.amount,
            order_id: orderResponse.data.data.id,
            name: "Acad+",
            description: "Thank you for purchasing the course.",
            image: "https://res.cloudinary.com/dqzzkgo3q/image/upload/v1744090651/Acad%2B/jpcvco11ywkhphz2gchm.jpg",
            prefill: {
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email,
            },
            handler: function (response) {
                console.log("Payment successful:", response);
                sendPaymentSuccessEmail(response, orderResponse.data.data.amount, userDetails, token)
                verifyPayment({ ...response, courses }, userDetails, token, navigate, dispatch)
            },
            modal: {
                ondismiss: function() {
                    console.log("Payment modal dismissed");
                    toast.error("Payment cancelled");
                }
            }
        }

        console.log("Initializing Razorpay with options:", options);
        try {
            const paymentObject = new window.Razorpay(options);
            console.log("Razorpay object created successfully");
            paymentObject.open();
            console.log("Payment modal opened");
            
            paymentObject.on("payment.failed", function(response) {
                console.log("Payment failed:", response.error);
                toast.error("Oops, payment failed");
            })
        } catch (error) {
            console.log("Razorpay initialization error:", error);
            toast.error("Could not initialize payment gateway");
        }
    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, user, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, user, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, ypou are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}