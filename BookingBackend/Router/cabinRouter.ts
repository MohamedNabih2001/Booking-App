import express from "express";
import {
  deleteCabin,
  createCabin,
  getAllCabins,
  getCabin,
  updateCabin,
} from "../Controller/cabinController";
import { authMe, restrictToAdmin } from "../Handler/authHandler";
import { upload } from "../Utility/cloudinary";

export const cabinRouter = express.Router();
/////////////////////////////////////////////
const cabinImagesUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

cabinRouter
  .route("/")
  .get(getAllCabins)
  .post(authMe, restrictToAdmin, cabinImagesUpload, createCabin);
/////////////////////////////////////////////
cabinRouter
  .route("/:id")
  .get(getCabin)
  .put(authMe, restrictToAdmin, cabinImagesUpload, updateCabin)
  .patch(authMe, restrictToAdmin, deleteCabin);
