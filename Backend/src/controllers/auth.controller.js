import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt";

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

export const login = async (req, res) => {
  try {
    const email = (req.body.email).trim();
    const password = (req.body.password).trim();
    if(!email || !password){
      return res.status(400).json({status: "failed", message: "All the fields are required"});
    }
    const user = await User.findOne({email});
    // console.log(user);
    if(!user){
      return res.status(400).json({status: "failed", message: "user doesn't exist"});
    }
    // console.log(password);
    // console.log(user.password);
    const passCheck = await bcrypt.compare(password, user.password);
    // console.log(passCheck);
    if(!passCheck){
      return res.status(400).json({status: "failed", message: "Wrong password"});
    }
    generateToken(user._id, res);
      return res.status(200).json({status: "Succesfull", message: "login successfull"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({status: "failed", message: "Internal server error"});
  }
}

export const logout = async (req, res) => {
  req.clearCookie('jwt');
  return res.status(200).json({status: "success", message: "logout succesfull"});
}
