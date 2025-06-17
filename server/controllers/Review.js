const Review = require("../models/RatingAndReview")
const User = require("../models/User")
const Course = require("../models/Course")
const RatingAndReview = require("../models/RatingAndReview")

exports.createReview = async (req, res) => {
    try{
        const { courseId, rating, review } = req.body
        const userId = req.user.id
        if(!courseId || !rating || !review){
            return res.status(400).json({
                success: false,
                message: "Enter all fields"
            })
        }
        
        // Check if user is a part of the course
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: {$elemMatch: {$eq: userId}}
        })
        
        // if(!courseDetails){
        //     return res.status(400).json({
        //         success: false,
        //         message: "Student is not enrolled in the course"
        //     })
        // }

        // Check if user already has a review
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        })
        if(alreadyReviewed){
            return res.status(400).json({
                success: false,
                message: "User has already reviewed the course"
            })
        }

        const revBody = await Review.create({
            user: userId,
            rating: rating,
            review: review,
            course: courseId,
        })
        if(!revBody){
            return res.status(400).json({
                success: false,
                message: "Couldnt write the review (Body)"
            })
        }

        const courseReview = await Course.findByIdAndUpdate(
            courseId,
            {$push: {
                ratingAndReview: revBody._id,
            }},
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Review created successfully",
            revBody,
            courseReview
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.fetchAverageRating = async (req, res) => {
    try{
        const { courseId } = req.body
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Couldnt find courseId"
            })
        }

        const courseDetails = await Course.findById(courseId).populate("ratingAndReview")
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "No ratings found"
            })
        }
        console.log("Course Details : ", courseDetails)
        
        // Create a "ratings" object that holds values of all ratings, sum it and average it
        const ratings = courseDetails.ratingAndReview.map(review => review.rating);
        const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
        const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;

        // Get rating via aggregate
        const result = await RatingAndReview.aggregate([
            {
                $match: {course: new mongoose.Types.ObjectId(courseId)}
            },
            {
                $group:{
                    _id: null,
                    averageRating: { $avg: "$rating"}
                }
            } 
        ])

        return res.status(200).json({
            success: true,
            message: "Average rating fetched",
            averageRating
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.fetchAllReviews = async (req, res) => {
    try{
        const { courseId } = req.body
        if(!courseId){
            return res.status(400).json({
                success: false,
                message: "Couldnt find courseId"
            })
        }
        
        // Alternate Method 
        // const allReviews = await RatingAndReview.find({ course: courseId });
        
        const allReviewsParent = await Course.findById(courseId)
            .select("ratingAndReview")
            .populate("ratingAndReview")
            .exec()

        if(!allReviewsParent){
            return res.status(400).json({
                success: false,
                message: "No ratings found"
            })
        }
        const allReviews = allReviewsParent.ratingAndReview

        return res.status(200).json({
            success: true,
            message: "All reviews fetched",
            allReviews
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}