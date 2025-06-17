const cloudinary = require("cloudinary").v2;

exports.videoUploadToCloudinary = async (file, folder) => {
    try {
        const options = { 
            folder,
            resource_type: "video",
            chunk_size: 6000000, // 6MB chunks
            eager: [
                { format: "mp4", quality: "auto" }
            ]
        };
        
        console.log("Uploading video to Cloudinary:", file.tempFilePath);
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        console.log("Video upload result:", result);
        return result;
    } catch (error) {
        console.error("Error uploading video to Cloudinary:", error);
        throw error;
    }
}; 