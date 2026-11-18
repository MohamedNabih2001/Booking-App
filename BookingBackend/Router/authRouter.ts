import express from "express";
import { login, logout, refresh, register } from "../Controller/authController";
import { authMe } from "../Handler/authHandler";

export const authRouter = express.Router();

authRouter.route("/signin").put(login);
authRouter.route("/register").post(register);
authRouter.route("/logout").put(authMe, logout);
authRouter.route("/refresh").get(refresh);
