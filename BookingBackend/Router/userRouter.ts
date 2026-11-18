import express from "express";
import { authMe, restrictToAdmin } from "../Handler/authHandler";
import {
  getMyInfo,
  getUsers,
  makeAdmin,
  updateData,
} from "../Controller/userController";

export const userRouter = express.Router();
userRouter.route("/").get(authMe, getMyInfo).put(authMe, updateData);
userRouter.route("/:id").put(authMe, restrictToAdmin, makeAdmin);
userRouter.route("/all").get(authMe, restrictToAdmin, getUsers);
