// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  fetchAllCourses,
  fetchCourseDetails,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course")


// Categories Controllers Import
const {
  fetchAllCategories,
  createCategory,
  fetchCategoryDetails,
} = require("../controllers/Category")

// Sections Controllers and Sub Section Import
const {
  createSection,
  updateSection,
  deleteSection,
  createSubSection,
  updateSubSection,
  deleteSubSection
} = require("../controllers/Section")

// Rating Controllers Import
const {
  createReview,
  fetchAverageRating,
  fetchAllReviews,
  getAllRating
} = require("../controllers/Review")

const {
  updateCourseProgress
} = require("../controllers/courseProgress");




// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/authMid")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************





// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// router.post("/createCourse", auth, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Get all Registered Courses
router.get("/fetchAllCourses", fetchAllCourses)
router.post("/fetchCourseDetails", fetchCourseDetails)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Delete a Course
router.post("/deleteCourse", deleteCourse)

// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);
router.post("/updateCourseProgress", auth, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/fetchAllCategories", fetchAllCategories)
router.post("/fetchCategoryDetails", fetchCategoryDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createReview", auth, isStudent, createReview)
router.get("/fetchAverageRating", fetchAverageRating)
router.get("/fetchAllReviews", fetchAllReviews)
router.get("/getAllRating", getAllRating)

module.exports = router