 const Tag = require("../models/Tag")

exports.createTag = async (req, res) => {
    try{
        const { name, description } = req.body
        if(!name || !description){
            res.status(400).json({
                success: false,
                message: "All fields are necessary",
            })
        }

        const tagDetails = await Tag.create({
            name: name,
            description: description,
        })
        console.log("Tag Details : ", tagDetails)
        res.status(200).json({
            success: true,
            message: 'Tag created successfully',
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.fetchAllTags = async ( req, res) => {
    try{
        // Fetch all tags with no params (just check that name and desc are present)
        const allTags = await Tag.find({}, {name: true, description: true })
        console.log("All Tags : ", allTags)
        res.status(200).json({
            success: false,
            message: 'Fetching all tags',
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

