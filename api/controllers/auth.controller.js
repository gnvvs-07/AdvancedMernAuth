import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
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
    // token generator
    generateTokenAndSetCookie(res, user._id);
    // sending verification token to user via mailtrap
    await sendVerificationEmail(user.email, verificationToken);
    // response
    res.status(201).json({
      success: true,
      message: "User creation completed",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to sign up",
    });
  }
};
export const verifyEmail = async (req, res) => {
  // logic: find the verification token
  // access the token from the body
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    // if user doesnot exists
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification token" });
    }
    // make the user verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    // save the user
    await user.save();
    // send welcome email
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verification success",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to verify email" });
  }
};
export const login = async (req, res) => {
  // logic: find the user by email
  const { email, password } = req.body;
  try {
    // find the user in db
    const user = await User.findOne({ email });
    // if user doesnot exists
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User doesnot exist" });
    }
    // password verification
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    // if incorrect password
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Incorrect password and email combination",
        });
    }
    // generate the token
    generateTokenAndSetCookie(res, user._id);
    // update user last login time
    user.lastLogin = new Date();
    await user.save();
    // sending the response
    res.status(200).json({
      success: true,
      message: "Login success",
      user: {
        ...user._doc,
        // ^🕳️^ the password is set to undefined in the response not in the database
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in loggin in");
    throw new Error("Error while user login");
  }
};
export const logout = async (req, res) => {
  // logic: remove the token from the user
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User log-out successfull",
  });
};
