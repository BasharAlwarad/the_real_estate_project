import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ?? '',
  api_key: process.env.API_KEY ?? '',
  api_secret: process.env.API_SECRET ?? '',
  secure: true,
});

// Upload an image
interface CloudUploaderRequest extends Express.Request {
  image?: {
    filepath: string;
  };
  body: {
    image?: string;
    [key: string]: any;
  };
}

interface CloudUploaderResponse extends Express.Response {}

import { NextFunction } from 'express';

type CloudUploaderNextFunction = NextFunction;

const cloudUploader = async (
  req: CloudUploaderRequest,
  res: CloudUploaderResponse,
  next: CloudUploaderNextFunction
): Promise<void> => {
  try {
    // If there's no file to upload, skip this middleware
    if (!req.image) {
      return next();
    }

    const filePath = req.image.filepath;

    const cloudinaryData: { secure_url: string } =
      await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto',
      });

    // Set the Cloudinary URL to req.body.image
    req.body.image = cloudinaryData.secure_url;

    next();
  } catch (error) {
    next(error);
  }
};

export default cloudUploader;
