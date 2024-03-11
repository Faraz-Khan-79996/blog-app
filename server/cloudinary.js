// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"

const {v2} = require('cloudinary')
const cloudinary = v2
const fs =  require('fs')
require('dotenv').config()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//If the file exist, upload and delete from local server
//if failed, still delete from local server.
//return response in each case

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return error;
    }
}

// export {uploadOnCloudinary}
module.exports = uploadOnCloudinary