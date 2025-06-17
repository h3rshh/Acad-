// Import the required modules
const express = require("express")
const router = express.Router()

const { 
    capturePayment, 
    verifyPayment, 
    sendPaymentSuccessEmail 
} = (() => {
    const paymentController = require("../controllers/Payment");
    // console.log("Payment Controller Exports: ", paymentController);
    return paymentController;
})();
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/authMid")

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router