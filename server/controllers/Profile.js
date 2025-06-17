const Profile = require("../models/Profile")
const User = require("../models/User")
const { imageUploadToCloudinary } = require("../utils/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
const fs = require('fs');
const path = require('path');
const Course = require("../models/Course")

exports.updateProfile = async(req, res) => {
    try{
        const {dateOfBirth="", about="", contactNumber, gender} = req.body
        console.log("Fetched basic data")
        const id = req.user.id
        console.log("ID : ", id)
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "All input params not present"
            })
        }
        
        const userDetails = await User.findOne({_id: id})
        const profileId = userDetails.additionalDetails
        const profileDetails = await Profile.findById(profileId)
    
        console.log("Old profile: ", profileDetails)

        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber
        profileDetails.gender = gender
        await profileDetails.save()

        return res.status(200).json({
            success: true,
            message: "Profile Updated",
            profileDetails
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteAccount = async(req, res) => {
    try{
        const id = req.user.id
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails})

        // TODO : Unenroll the student from all courses
        // Find out out to schedule deletion
        // Find out about cronjob        
        await User.findByIdAndDelete({_id: id})
        return res.status(200).json({
            success: true,
            message: "Account Deleted Successfully",
            userDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.fetchAllUserDetails = async(req, res) => {
    try{
        const id = req.user.id
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .populate("courses")
            .exec()
        console.log("User Details : ", userDetails)
        return res.status(200).json({
            success: true,
            message: "All user details fetched successfully",
            userDetails
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateProfilePicture = async (req,res) => {
    try{
        // const defaultImagePath = path.join(__dirname, 'utils', 'default.png');
        // const defaultImageBuffer = fs.readFileSync(defaultImagePath);
        // const base64Image = `data:image/png;base64,${defaultImageBuffer.toString("base64")}`;
        // let newPic = base64Image

        console.log("Files : ", req.files)
        let newPic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/epzDzsAAAAASUVORK5CYII=";
        if(req?.files?.displayPicture){ console.log("FIle exists"); newPic = req.files.displayPicture.tempFilePath }
        else{ console.log("File doesnt exist")}
        
        console.log("New Pic tyoe : ",typeof newPic, " newpic : ", newPic)
        

        const userId = req.user.id
        if(!newPic){
            return res.status(400).json({
                success: false,
                message: "No image found"
            })
        }
        const image = await imageUploadToCloudinary({
            file: newPic,
            folder: process.env.FOLDER_NAME,
            height: 1000,
            quality: 1000
        })
        console.log("Image : ", image)

        const oldUser = await User.findByIdAndUpdate(
            {_id: userId},
            {image: image.secure_url},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "New image uploaded",
            oldUser
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
      console.log("Entered Backend to get Enrolled courses")
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: "User not found"
        })
      }

      // console.log("User Details : ", userDetails)
      userDetails = userDetails.toObject()
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
          ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
          userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseId: userDetails.courses[i]._id,
          userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
      // console.log("User Details after processing : ", userDetails)
      return res.status(200).json({
        success: true,
        data: userDetails,
      })
    } catch (error) {
      console.log("Error in getEnrolledCourses:", error)
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })
    console.log("Type of courseDetails: ", typeof courseDetails)
    console.log("Course Details : ", courseDetails)
    if(courseDetails.length === 0){
      return res.status(200).json({
        "message": "No courses found for this instructor"
      })
    }

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}