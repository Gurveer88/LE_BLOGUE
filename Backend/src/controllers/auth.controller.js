import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be atleast 8 characters" });
    }

    const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email_regex.test(email)) {
      return res
        .status(400)
        .json({ message: "Given email is invalid, try again" });
    }

    const existing_User = await User.findOne({ email });
    if (existing_User) {
      console.log(existing_User);
      return res
        .status(400)
        .json({ message: "User already exists in the database" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    await generateToken(newUser._id, res);
    return res.status(200).json({message: "User registered successfully"});
  } catch (error) {
    console.log("Error in the register controller : ", error);
  }
};
