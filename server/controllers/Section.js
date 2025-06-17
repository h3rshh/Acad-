const Section = require("../models/Section")
const Course = require("../models/Course")
const SubSection = require("../models/SubSection")
const { imageUploadToCloudinary } = require("../utils/imageUploader")
const { videoUploadToCloudinary } = require("../utils/videoUploader")
const { subscribe } = require("../routes/User")

exports.createSection = async ( req, res ) => {
    try{
        const { sectionName, courseId } = req.body
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            })
        }

        const newSection = await Section.create({ sectionName })
        console.log("New section id : ", newSection._id)
        
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true }
        );
        
        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();
        
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Couldnt create section"
        })
    }
}

exports.updateSection = async (req, res) => {
    try{
        // Can update only section name
        const { sectionName, sectionId, courseId } = req.body
        console.log("New section name and id: ", sectionName, " ", sectionId)
        if(!sectionName || !sectionId){ return res.status(401).json({
            success: false,
            message: "Missing fields"
        })}

        const section = await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new: true},
        )

        const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            data: course,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.deleteSection = async (req, res) => {
    try{
        // This is assuming we get section id from a param
        console.log("Entered delete section")
        const { sectionId, courseId } = req.body 
        console.log("SectionId : ", sectionId)

        const oldCourse = await Course.findById(courseId) 
        console.log("Old course : ", oldCourse)
        await Course.findByIdAndUpdate(
            courseId,
            {$pull: {
                courseContent: sectionId,
            }},
            {new: true}
        )

        const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}
        await SubSection.deleteMany({_id: {$in: section.subSection}});
        await Section.findByIdAndDelete(sectionId);

        const updatedCourse = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();
        console.log("Section removed from course, updated course : ", updatedCourse)
        
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            data: updatedCourse,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

exports.createSubSection = async (req, res) => {
    try{
        const {sectionId, title, description} = req.body
        const video = req?.files?.video // Get video file from request

        console.log("createSubSection - Received data: ", {sectionId, title, description});
        console.log("createSubSection - req.files:", req.files);
        console.log("createSubSection - video object:", video);
        if (video) {
            console.log("createSubSection - video file details:", {
                name: video.name,
                size: video.size,
                mimetype: video.mimetype,
                tempFilePath: video.tempFilePath
            });
        }

        if(!sectionId || !title || !description){
            return res.status(400).json({
                success: false,
                message: "All fields must be present (title, description, sectionId)"
            })
        }
        
        let videoUploadDetails = { secure_url: "", duration: "0" }; // Initialize with empty values

        if(video){ // Only upload if a video file is provided
            videoUploadDetails = await videoUploadToCloudinary(
                video, 
                process.env.FOLDER_NAME
            )
            console.log("Cloudinary upload response:", videoUploadDetails);
        } else {
            console.log("No video file provided for upload.");
        }

        const newSubSection = await SubSection.create({
            title: title,
            timeDuration: `${videoUploadDetails.duration || "0"}`,
            description: description,
            videoUrl: videoUploadDetails.secure_url
        })
        
        const updatedSection = await Section.findByIdAndUpdate(
            {_id: sectionId},
            {$push: {
                subSection: newSubSection._id,
            }},
            {new: true}
        ).populate("subSection").exec(); // Populate immediately to return updated data

        console.log("Updated section after subsection creation:", updatedSection);

        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            data: updatedSection
        })
    }
    catch(error){
        console.error("Error creating subsection:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Could not create subsection"
        })
    }
}

exports.updateSubSection = async (req, res) => {
    try{
        const { sectionId, subSectionId, title, description } = req.body
        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: "No subsection found"
            })
        }
        console.log("Entered")
        const updates = {}
        if(title){ updates.title = title }
        if(description){ updates.description = description }

        if(req.files && req.files.video){ 
            const uploadDetails = await videoUploadToCloudinary(
                req.files.video, 
                process.env.FOLDER_NAME
            )
            updates.videoUrl = uploadDetails.secure_url
            updates.timeDuration = uploadDetails.duration
        }
        console.log("Updates : ", updates)

        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            {$set: updates},
            {new: true}
        )
        console.log("Updated Subsection : ", updatedSubSection)
        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Failed to updates (ID exists but still failed)",
            });
        }

        const updatedSection = await Section.findById(sectionId)
            .populate("subSection")
            .exec()

        return res.status(200).json({
            success: true,
            message: "Subsection updated successfully",
            data:updatedSection
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try{
        const { subSectionId, sectionId } = req.body
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success: true,
                message: "Fields not present"
            })
        }

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {$pull: {
                subSection: subSectionId,
            }},
            {new: true}  
        )
        
        const delSubSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
        if (!delSubSection) {
            return res
              .status(404)
              .json({ success: false, message: "SubSection not found" })
        }

        const finalSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        return res.status(200).json({
            success: true,
            message: "Subsection deletd successfully",
            data: finalSection
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}