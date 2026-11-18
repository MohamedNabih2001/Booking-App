import { NextFunction, Response, Request } from "express";
import { Cabin, ImageType } from "../Model/cabinModel";
import { AppError } from "../Utility/AppError";
import { ERROR_CODES, ERROR_MESSAGES } from "../Utility/ErrorsType";
import {
  deleteImageCloudinary,
  UploadImageToCloudinary,
} from "../Utility/cloudinary";
import { CloudinaryUploadResult } from "../../../E-Commerce-1/frontend/ecommerce/Ecommerce-1/src/cloudinary/UploadWidget";

export const getAllCabinsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const filters = { ...req.query };
  let queryStr = JSON.stringify(filters);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  const filter = JSON.parse(queryStr);

  for (const key in filter) {
    if (typeof filter[key] === "object") {
      for (const operator in filter[key]) {
        filter[key][operator] = Number(filter[key][operator]);
      }
    }
  }

  console.log(filter);
  const cabins = await Cabin.find(filter).sort("name");
  res.json({ message: "get all cabins successfully", data: cabins });
};

/////////////////////////////////////////////////////////

export const getCabinHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cabinId = req.params.id;
  const cabin = await Cabin.findById(cabinId);
  res.json({ message: "get cabin successfully", data: cabin });
};
/////////////////////////////////////////////////////////

export const deleteCabinHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cabinId = req.params.id;
  const cabinExist = await Cabin.exists({ _id: cabinId });
  if (!cabinExist) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }

  const cabin = await Cabin.findByIdAndUpdate(cabinId, { isAllowed: false });
  res.json({ message: "delete cabin successfully", data: cabin });
};
/////////////////////////////////////////////////////////

export const addCabinHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body) {
    return next(
      new AppError(ERROR_MESSAGES.DATA_MISSING, ERROR_CODES.DATA_MISSING),
    );
  }

  //////////////////////////////////
  console.log(req.body);

  const cabinData = { ...req.body, isAllowed: true, reservationsDates: [] };
  //////////////////////////////////
  const files = req.files as {
    mainImage?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };
  const singleImage = files.mainImage?.[0];
  const imagesGroup = files.images ?? [];
  //////////////////////////////////
  let mainImage;
  let images;
  //////////////////////////////////
  if (singleImage) {
    const imageCloudinary = (await UploadImageToCloudinary(
      "Cabins",
      singleImage.buffer,
    )) as CloudinaryUploadResult;
    mainImage = {
      imageUrl: imageCloudinary.secure_url,
      publicId: imageCloudinary.public_id,
    };
    cabinData.mainImage = mainImage;
  }
  //////////////////////////////////
  if (imagesGroup.length > 0) {
    const imagesCloudinary: any = imagesGroup.map((image) => {
      return UploadImageToCloudinary("Cabins", image.buffer);
    });
    const imagesFromCloudinary = (await Promise.all(
      imagesCloudinary,
    )) as CloudinaryUploadResult[];
    images = imagesFromCloudinary.map((image) => {
      return {
        imageUrl: image.secure_url,
        publicId: image.public_id,
      };
    });
    cabinData.images = images;
  }

  //////////////////////////////////
  const cabin = await Cabin.create(cabinData);
  res.json({ message: "create cabin successfully", data: cabin });
};
/////////////////////////////////////////////////////////

export const updateCabinHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cabinId = req.params.id;
  const cabin = await Cabin.findById(cabinId);
  /////////////////////////////////
  if (!cabin) {
    return next(new AppError(ERROR_MESSAGES.CONFLICT, ERROR_CODES.CONFLICT));
  }
  /////////////////////////////////
  const deletedImages: ImageType[] | [] = req.body.deletedImages
    ? JSON.parse(req.body.deletedImages)
    : [];

  /////////////////////////////////
  ///////////////////////////////////
  const deletedIds = new Set(deletedImages.map((image) => image.publicId));
  const imagesStay =
    cabin?.images.filter((image) => !deletedIds.has(image.publicId)) || [];
  /////////////////////////////////////////
  const cabinData = { ...req.body };
  if (cabinData.deletedImages) {
    delete cabinData.deletedImages;
  }
  //////////////////////////////////
  const files = req.files as {
    mainImage?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };
  const singleImage = files.mainImage?.[0];
  const imagesGroup = files.images ?? [];
  //////////////////////////////////
  let mainImage;
  let images;
  //////////////////////////////////
  if (singleImage) {
    const imageCloudinary = (await UploadImageToCloudinary(
      "Cabins",
      singleImage.buffer,
    )) as CloudinaryUploadResult;
    mainImage = {
      imageUrl: imageCloudinary.secure_url,
      publicId: imageCloudinary.public_id,
    };
    cabinData.mainImage = mainImage;
    if (cabin && cabin.mainImage) {
      await deleteImageCloudinary(cabin.mainImage.publicId);
    }
  }
  //////////////////////////////////
  if (imagesGroup.length > 0) {
    const imagesCloudinary: any = imagesGroup.map((image) => {
      return UploadImageToCloudinary("Cabins", image.buffer);
    });
    const imagesFromCloudinary = (await Promise.all(
      imagesCloudinary,
    )) as CloudinaryUploadResult[];
    images = imagesFromCloudinary.map((image) => {
      return {
        imageUrl: image.secure_url,
        publicId: image.public_id,
      };
    });
    cabinData.images = [...images, ...imagesStay];
  } else if (deletedImages.length > 0) {
    cabinData.images = [...imagesStay];
  }

  //////////////////////////////////
  const newCabin = await Cabin.findByIdAndUpdate(cabinId, cabinData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (deletedImages.length > 0) {
    await Promise.all(
      deletedImages.map((image: ImageType) => {
        return deleteImageCloudinary(image.publicId);
      }),
    );
  }
  res.json({ message: "update cabin successfully", data: newCabin });
};
