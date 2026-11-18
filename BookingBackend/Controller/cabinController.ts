import {
  addCabinHandler,
  deleteCabinHandler,
  getAllCabinsHandler,
  getCabinHandler,
  updateCabinHandler,
} from "../Handler/cabinHandler";
import { asyncHandler } from "../Utility/globalError";

export const getAllCabins = asyncHandler(getAllCabinsHandler);
export const getCabin = asyncHandler(getCabinHandler);
export const createCabin = asyncHandler(addCabinHandler);
export const deleteCabin = asyncHandler(deleteCabinHandler);
export const updateCabin = asyncHandler(updateCabinHandler);

//////////////////

//upload.fields([
//   { name: "mainImage", maxCount: 1 },
//   { name: "images", maxCount: 20 },
// ]);

// req.files = {
//   image: [
//     {
//       fieldname: "image",
//       originalname: "cover.jpg",
//       buffer: <Buffer ...>,
//     },
//   ],
//   images: [
//     {
//       fieldname: "images",
//       originalname: "1.jpg",
//       buffer: <Buffer ...>,
//     },
//     {
//       fieldname: "images",
//       originalname: "2.jpg",
//       buffer: <Buffer ...>,
//     },
//   ],
// };
