const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const Tag = require("../models/Tag")
const User = require("../models/User")
const { imageUploadToCloudinary } = require("../utils/imageUploader")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")


exports.createCourse = async (req, res) => {
    try{
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions,
          } = req.body
        
        // Convert the tag and instructions from stringified Array to Array
        // const tag = JSON.parse(_tag)
        // const instructions = JSON.parse(_instructions)
        
        if (!status || status === undefined) {
            status = "Draft"
        }

        // console.log("Entered course : ", courseName)
        console.log("User : ", req.user)

        // Check if the user is really an instructor instructor
        const userId = req.user.id
        const instructorDetails = await User.findById(userId,
            {accountType: "Instructor"}
        )
        if(!instructorDetails){
            res.status(400).json({
                success: false,
                message: "Instructor Not Found",
            })
        }

        // Check if the tag given is valid
        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            })
        }
        console.log("Categor : ", categoryDetails)

        // Handle thumbnail upload
        let thumbnailImage = { secure_url: "" }
        if (req.files && req.files.thumbnailImage) {
            const img = req.files.thumbnailImage
            console.log("Thumbnail file received:", img)
            thumbnailImage = await imageUploadToCloudinary(
                img,
                process.env.FOLDER_NAME
            )
            console.log("Image uploaded to cloudinary:", thumbnailImage)
        }

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions,
        })
        console.log("Course created: ", newCourse)
        // Update the user (add course to Instructors' courses)
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true },
        )
        console.log("Course added to instructors' list")
        // Add the new course to the Categories
        const categoryDetails2 = await Category.findByIdAndUpdate(
            { _id: category },
            {$push: {
                courses: newCourse._id,
            }},
            { new: true }
        )
        console.log("Course added to categories' list, ALL DONE")

        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            newCourse,
            categoryDetails2
        })
    } 
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.fetchAllCourses = async (req, res) => {
    try{
        const allCourses = await Course.find({}, {
            courseName: true,
            courseDescription: true,
            thumbnail: true,
            instructor: true,
            ratingAndReview: true,
            studentsEnrolled: true,
        })
        .populate("instructor")
        .exec()

        console.log("All Courses : ", allCourses)
        return res.status(200).json({
            success: true,
            message: "All Courses fetched",
            data: allCourses
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.fetchCourseDetails = async (req, res) => {
    try{
        const { courseId } = req.body
        console.log("Entered fetch course details with id: ", courseId)
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Couldnt fild courseId"
            })
        }

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails"
                }
            })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            }) 
            .populate("ratingAndReview")
            .populate("category")
            .populate("studentsEnrolled")
            .exec()
        
        console.log("COurse details: ", courseDetails)
        return res.status(200).json({
            success: true,
            message: "All course data available",
            courseDetails
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "-videoUrl",
          },
        })
        .exec()
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.getFullCourseDetails = async (req, res) => {
    try {
      // console.log("Entered Backend Get Full course Details Function")
      const { courseId } = req.body
      const userId = req.user.id
      console.log("Entered Backend Get Full course Details Function, courseid and token: ", courseId, " ", userId)
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "title description timeDuration videoUrl",
          },
        })
        .exec()
      console.log("Fetched basic course Details: ", courseDetails)
  
      let courseProgressCount = await CourseProgress.findOne({
        courseId: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor with populated sections and subsections
      const instructorCourses = await Course.find({
        instructor: instructorId,
      })
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .sort({ createdAt: -1 })
        .exec()
  
      // Calculate duration for each course
      const coursesWithDuration = instructorCourses.map((course) => {
        let totalDurationInSeconds = 0
        
        // Calculate total duration from all subsections
        course.courseContent.forEach((content) => {
          content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration) || 0
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
        
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        
        // Return course with calculated duration
        return {
          ...course.toObject(),
          totalDuration
        }
      })
  
      // Return the instructor's courses with calculated durations
      res.status(200).json({
        success: true,
        data: coursesWithDuration,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      console.log("Entered delete course")
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) { 
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course

      const studentsEnrolled = course.studentsEnrolled
      if(studentsEnrolled)
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }

  exports.editCourse = async (req, res) => {
    try {
      console.log("Entered edit course : ", req.body)
      const { courseId } = req.body
      const  updates  = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await imageUploadToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = updates[key]
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReview")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }