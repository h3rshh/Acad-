const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")

// Auth Middleware
exports.auth = async (req, res, next) => {
    try{
        // console.log("Check1 for Auth Middleware")
        // console.log("Req : ", req)
        // console.log("Tokens : ", req.cookies, " , ", req.body)
        const token = (req.cookies?.token) 
                        || (req.body?.token)
        // const token = req.body.token
                        || (req.header("Authorization")?.replace("Bearer ", ""));
        // console.log("Token : ", token)
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Token Doesnt exist'
            })
        }
        // console.log("Check2")
        try{
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            // console.log("Decode (Auth Middleware) : ", decode)
            req.user = decode
        }
        catch(error){
            return res.status(401).json({
                success: false,
                message: "Token is wrong/invalid"
              })
        }
        console.log("Auth Succesful, token : ", token)
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating (auth Middleware)"
          })
    }
}


exports.isStudent = (req, res, next) => {
    try{
        console.log("Entered isStudent")
        // console.log("Res : ", res)
        console.log("Req : ", req)
        console.log(req.user)
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for only students"
            })
        }
        next()
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong verifying student"
        })
    }
}


exports.isInstructor = (req, res, next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for only Instructors"
            })
        }
        console.log("Instructor middleware satisfied")
        next()
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong verifying Instructor"
          })
    }
}


exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for only Admin"
            })
        }
        next()
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Something went wrong verifying admins"
          })
    }
}