import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as streamifier from "streamifier";
import { getEnv } from "./GetEnv";

const cloudName = getEnv("CLOUDINARY_NAME");
const cloudApiKey = getEnv("CLOUDINARY_API_KEY");
const cloudApiSecret = getEnv("CLOUDINARY_API_SECRET");

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudApiKey,
  api_secret: cloudApiSecret,
});

export default cloudinary;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Cant upload this file. Image only"));
    }
  },
});

////////////////////////////////////////

export const UploadImageToCloudinary = (
  imageFolder: string,
  fileBuffer: Buffer,
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `BookingApp/${imageFolder}`,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const deleteImageCloudinary = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId);
};
