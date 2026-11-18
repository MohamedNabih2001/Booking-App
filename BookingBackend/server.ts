import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import { getEnv } from "./Utility/GetEnv";
import { globalErrorHandler } from "./Utility/globalError";
import { authRouter } from "./Router/authRouter";
import { connectDB } from "./Lib/monogdDbConnect";
import { userRouter } from "./Router/userRouter";
import { cabinRouter } from "./Router/cabinRouter";
import { reservationRouter } from "./Router/reservationRouter";
import { mailRouter } from "./Router/mailRouter";
dotenv.config();
const app = express();

//security
app.use(helmet());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(hpp());

//general middleware
app.use(
  cors({
    origin: getEnv("FRONTEND_URL"),
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("query parser", "extended");
// routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/cabin", cabinRouter);
app.use("/api/reservation", reservationRouter);
app.use("/api/mail", mailRouter);

app.use(globalErrorHandler);

await connectDB();

const port = getEnv("PORT");
app.listen(port, () => {
  console.log("server is connected " + "on port " + port);
});
