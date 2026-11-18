import mongoose from "mongoose";
import { getEnv } from "../Utility/GetEnv";

const mongodbUser = getEnv("MONGODB_USER");
const mongodbPassword = getEnv("MONGODB_PASSWORD");

const uri = `mongodb+srv://${mongodbUser}:${mongodbPassword}@bookingapp.ac5t9cw.mongodb.net/BookingApp?retryWrites=true&w=majority&appName=BookingApp`;

export async function connectDB() {
  await mongoose.connect(uri);

  console.log("✅ MongoDB Connected");
}
