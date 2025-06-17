const cloudinary = require("cloudinary").v2;

exports.imageUploadToCloudinary = async (file, folder) => {
    try {
        const options = { folder };
        options.resource_type = "image";
        
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};

// const cloudinary = require("cloudinary").v2

// exports.imageUploadToCloudinary = async (file, folder, height, quality) => {
    
//     const options = { folder }
//     if(height){ options.height = height }
//     if(quality){ options.quality = quality }
//     options.resource_type = "auto"

//     return await cloudinary.uploader.upload(file, options);
// }