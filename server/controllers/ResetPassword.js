const User = require("../models/User")
const bcrypt = require("bcrypt")
const mailSender = require("../utils/mailSender")

exports.resetPasswordToken = async(req, res) => {
    try{
        // console.log("Entered Server reset pass token")
        const email = req.body.email;
        const user = await User.findOne({ email: email })
        if(!user){
            return res.json({
                success: false,
                message: 'Your email is not registered'
            })
        }

        // Generate token
        const token = crypto.randomUUID()
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5*60*1000
            },
            { new: true },
        )

        const url = `http://localhost:5173/update-password/${token}`
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link: ${url}`
        )

        return res.json({
            success: true,
            message: "Email send successfully, please check your email and change your password",
            url
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.resetPassword = async(req, res) => {
    try{
        const { password, confirmPassword, token } = req.body;
        if(password != confirmPassword){
            return res.json({
                success: false,
                message: 'Passwords dont match',
            })
        }
        
        const userDetails = await User.findOne({ token: token })
        
        if(!userDetails){
            return res.json({
                success: false,
                message: 'Token is invalid',
            })
        }
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Token is expired",
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        newUserDetails = await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        )
        console.log("check3")
        return res.status(200).json({
            success: true,
            message: 'Password reset successful',
            userDetails,
            newUserDetails, 
        })
    }
    catch(error){
        return res.status(500).json({
            success: true,
            message: error.message,
        })
    }
}


