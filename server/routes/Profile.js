const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/authMid")

const {
  deleteAccount,
  updateProfile,
  fetchAllUserDetails,
  updateProfilePicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/fetchUserDetails", auth, fetchAllUserDetails)

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateProfilePicture", auth, updateProfilePicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router