import { v2 as cloudinary } from "cloudinary";

const hasCloudinaryConfig = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

if (hasCloudinaryConfig()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadToCloudinary = (fileBuffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });

    stream.end(fileBuffer);
  });

export const uploadMediaFile = async (file, { folder, resourceType = "image" }) => {
  if (!hasCloudinaryConfig()) {
    throw new Error("Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.");
  }

  const result = await uploadToCloudinary(file.buffer, {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true
  });

  return result.secure_url;
};
