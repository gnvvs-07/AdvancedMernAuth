import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
// authentication functionalities
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    // verification code
    const verificationToken = generateVerificationToken();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000, //one hour
    });
    // add the user to db
    await user.save();
    // token
    generateTokenAndSetCookie(res, user._id);
    // response
    res.status(201).json({
      success:true,
      message:"User creation completed",
      user:{
        ...user._doc,
        password:undefined,
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to sign up",
    });
  }
};
export const login = async (req, res) => {};
export const logout = async (req, res) => {};
