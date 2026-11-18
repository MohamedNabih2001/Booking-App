import express from "express";
import { asyncHandler } from "../Utility/globalError";
import {
  forgetPassword,
  resetPassword,
  validateTokenResetPassword,
} from "../Handler/authHandler";
export const mailRouter = express.Router();

mailRouter.put("/send", asyncHandler(forgetPassword));
mailRouter.put("/validate", asyncHandler(validateTokenResetPassword));
mailRouter.put("/resetNewPassword", asyncHandler(resetPassword));
