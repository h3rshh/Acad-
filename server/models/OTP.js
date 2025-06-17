const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 10000*60,
    }
});

async function sendVerificationMail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification Email from Acad+", otp);
        console.log("Email send successfully : ", mailResponse)
    }
    catch(error){
        console.log(error.message)
    }
}

otpSchema.pre("save", async function (next) {
    await sendVerificationMail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema)