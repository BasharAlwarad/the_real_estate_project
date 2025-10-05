import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure_url: true,
});

// Upload an image
const cloudUploader = async (req, res, next) => {
  try {
    // If there's no file to upload, skip this middleware
    if (!req.image) {
      console.log('📝 No file to upload, using provided URL or no image');
      return next();
    }

    const filePath = req.image.filepath;

    const cloudinaryData = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    // Set the Cloudinary URL to req.body.image
    req.body.image = cloudinaryData.secure_url;
    console.log('☁️☁️☁️ File uploaded successfully to cloudinary');

    next();
  } catch (error) {
    console.log('☁️☁️☁️ cloudinary error:', error);
    next(error);
  }
};

export default cloudUploader;
