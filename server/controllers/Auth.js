const bcrypt = require("bcryptjs")
const User = require("../models/User")
const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken")
const otpGenerator = require("otp-generator")
const mailSender = require("../utils/mailSender")
const otpTemplate = require("../mail/emailVerificationTemplate")
const { passwordUpdated } = require("../mail/passwordUpdate")
const Profile = require("../models/Profile")
require("dotenv").config()

// Signup Controller for Registering USers

exports.signup = async (req, res) => {
  console.log("Entered Signup")
  try {
    // Destructure fields from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body
    // Check if All Details are there or not
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required"
      })
    }
    console.log("Check1")
    if(password != confirmPassword){
      return res.status(400).json({
        success: false,
        message: "Passwords dont match"
      })
    }

    const existingUser = await User.findOne({ email })
    if(existingUser){
      return res.status(400).json({
        success: false,
        message: "User already registered"
      })
    }

    console.log("Check2")
    
    // Find most recent otp
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1)
    console.log("RecentOtp : ", recentOtp)
    if(recentOtp.length == 0){
      return res.status(400).json({
        success: false,
        message: "No OTP found"
      })
    }
    else if(otp != recentOtp.otp){
      console.log("Otp : ", otp, " , dbOtp : ", recentOtp.otp)
      return res.status(400).json({
        success: false,
        message: "Youve given an invalid OTP"
      })
    }

    console.log("Check3")
    // Hash password and save it
    const hashedPassword = await bcrypt.hash(password, 10)

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null
    })

    const user = await User.create({
      firstName, lastName, email, contactNumber, 
      password: hashedPassword, accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`
    })

    console.log("Check4")
    return res.status(200).json({
      success: true,
      message: "User registered",
      user
    })
  }
  catch(error){
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "User could not be registered"
    })
  }
}

exports.sendotp = async (req, res) => {
  try{
    // Get user Email and check if the user is new or not
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email })

    if(checkUserPresent){
      return res.status(403).json({
        success: false,
        message: "User already registered",
      })
    }

    // Generate unique OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    const result = await User.findOne({ otp: otp })
    while(result){
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      const result = await User.findOne({ otp: otp })
    }

    const otpPayload = { email, otp } 
    const otpBody = await OTP.create(otpPayload)
    console.log("OTP : ", otp)
    
    const mailBody = otpTemplate(otp)
    const mailStruct = await mailSender(email, "Your OTP for Registering to Acad+", mailBody)

    res.status(200).json({
      success: true,
      message: "OTP Sent successfully",
      mailBody,
      mailStruct,
    })
    
  }
  catch(error){
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.login = async (req, res) => {
  try {
    console.log("Entered Login")
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Enter all fields"
      })
    }
    
    const user = await User.findOne({ email })
    console.log("Found user : ", user)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No such user exists"
      })
    }
    
    console.log("Found user : ")
    // Match passwords and then generate Token
    if (await bcrypt.compare(password, user.password)) {
      console.log("Password matched")
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      user.token = token
      user.password = undefined
      const options = {
        httpOnly: true
      }
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "You've logged in successfully"
      })
    } else {
      // Add this else block to handle incorrect password
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.changePassword = async (req, res) => {
  try{
    // get data from body (email, oldpass, pass, confirmPass)
    const { email, oldPass, newPass, newConfirmPass } = req.body
    if(!email || !oldPass || !newPass || !newConfirmPass){
      return res.status(403).json({
        success: false,
        message: "Enter All fields"
      })
    }
    if(newPass != newConfirmPass){
      return res.status(400).json({
        success: false,
        message: "New Passwords dont match"
      })
    }
    console.log("Check1")
    // see if oldpass is correct and if pass matches confirmPass
    const user = await User.findOne({ email })
    if(!user){
      return res.status(401).json({
        success: false,
        message: "No such user exists"
      })
    }

    const oldHashedPassword = await bcrypt.hash(oldPass, 10)
    console.log("Check2")

    console.log("Hashed and DB : ", oldHashedPassword, " ", user.password)
    if(!(await bcrypt.compare(oldPass, user.password))){
      return res.status(400).json({
        success: false,
        message: "Wrong Password Entered"
      })
    }

    const hashedPassword = await bcrypt.hash(newPass, 10)
    console.log("Check3")
    await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true } 
    )

    const mail = await mailSender(email,
        "Password Changed",
        `Password Changed Successfully`
    ).catch((err) => {
      console.log("Error sending email:", err);
      return null;
    })

    console.log("Check4 and mail : ", mail)
    return res.json({ 
      success: true,
      message: "Password Changed successfully, check mail"
    })
    // Update pass in db
    // Send mail of password updated
    // return response
  }
  catch(error){
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}