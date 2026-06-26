import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async function () {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("The mongo db is connected");
    console.log("Connected DB:", mongoose.connection.name);
  } catch (error) {
    console.log("Sorry, the database wasn't able to connect", error);
    throw error;
  }
};
