const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const {
  sendVerificationLink,
  sendResetPasswordMail,
} = require("../config/mail");
const { equals, isEmail } = require("validator");

exports.register = async (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;

  if (!firstname || !lastname || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!email || !isEmail(email))
    return res.json({ message: "Please provide valid email address" });

  if (!equals(password, confirmPassword)) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const checkExist = await userModel.findOne({ email: email });

    if (checkExist && !checkExist.verified) {
      //   sendVerificationLink(checkExist.email, checkExist.OTP);
      return res.json({
        message: "We have sent an One Time Passcode to verify your account",
      });
    }

    if (checkExist && checkExist.verified)
      return res.status(400).json({ message: "Email already registered!" });

    // initialize user model
    const newUser = new userModel({ firstname, lastname, email });

    // generating password hash
    newUser.hashPassword(password);

    // generating verification Token
    await newUser.generateOTP();

    // attempting to save on db
    const saveUser = await newUser.save();

    if (!saveUser)
      return res.status(400).json({ message: "Oops! Something went wrong" });

    // sendVerificationLink(saveUser.email, saveUser.OTP)
    //     .then((result) => console.log(result))
    //     .catch((err) => console.log(err.message));

    return res.status(201).json({
      message: "We have sent an One Time Passcode to verify your account",
    });
  } catch (error) {
    return res.status(500).json({ message: "Oops! Something went wrong" });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email || !isEmail(email))
    return res
      .status(400)
      .json({ message: "Please provide valid email address" });

  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "No user found!" });

    if (user.verified)
      return res.status(400).json({ message: "User already verified" });

    sendVerificationLink(user.email, user.OTP);

    res.json({
      message: "OTP Resent",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Oops! Something went wrong",
      error: error.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email)
    return res.status(400).json({ message: "all fields are required" });

  if (!email || !isEmail(email))
    return res
      .status(400)
      .json({ message: "Please provide valid email address" });

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) return res.status(400).json({ message: "User not found!" });

    if (user.verified)
      return res.status(400).json({ message: "User already verified!" });

    if (user.OTP !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const updateUser = await userModel.updateOne(
      { email: user.email },
      {
        $set: {
          verified: true,
        },
        $unset: {
          OTP: null,
        },
      }
    );

    if (!updateUser) {
      return res
        .status(500)
        .json({ message: "Sorry! Couldn't verify your account!" });
    }

    return res.status(200).json({
      message:
        "Successfully verified your account. You can Log in to your account",
    });
  } catch (error) {
    return res.status(500).json({ message: "Oops! Something went wrong" });
  }
};

exports.signInWithEmail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !isEmail(email))
    return res.json({ message: "Please provide valid email address" });

  if (!password || password.length < 6)
    return res.json({ message: "Password must be 6 characters long" });

  try {
    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Invalid email address!" });

    if (!user.verified)
      return res.status(400).json({
        message: "Email is not verified!",
      });

    const checkPassword = await user.verifyPassword(password);

    if (!checkPassword)
      return res.status(403).json({ message: "Incorrect Password!" });

    const JWT_TOKEN = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("JWT_TOKEN", JWT_TOKEN, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json({ JWT_TOKEN, message: "Login Successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Oops! Something went wrong" });
  }
};

exports.logOut = (req, res) => {
  res.clearCookie("JWT_TOKEN");
  res.json({ message: "Logout Success!" });
};

exports.verifyJWT = async (req, res) => {
  const { JWT_TOKEN } = req.body;

  if (!JWT_TOKEN) return res.status(400).json({ message: "Invalid Token" });

  try {
    const isValid = jwt.verify(JWT_TOKEN, process.env.JWT_SECRET);

    const user = await userModel.findById(isValid.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      fullName: `${user.firstname} ${user.lastname}`,
      email: user.email,
    });
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized Token" });
  }
};

exports.changePassword = async (req, res) => {
  const { id } = req.userData;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword)
    return res.status(400).json({ message: "Password can't be empty!" });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match!" });

  try {
    const user = await userModel.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.verifyPassword(oldPassword))
      return res.status(400).json({ message: "Incorrect Password!" });

    user.hashPassword(newPassword);

    const updatePassword = await user.save();

    if (!updatePassword)
      return res.status(500).json({ message: "Failed to update password!" });

    return res.status(200).json({ message: "Sucessfully Updated password!" });
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized user" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !isEmail(email))
    return res.status(400).json({ message: "Please enter a valid Email" });

  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ email }, process.env.FORGET_PASSWORD_SECRET, {
      expiresIn: "1h",
    });

    sendResetPasswordMail(email, token);

    return res.json({
      message: "Please check your email inbox to reset your password!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Oops! Something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { password, confirmPassword } = req.body;

  if (!password || password.length < 6)
    return res.status(400).json({ message: "Please enter a valid password" });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match!" });

  try {
    const { email } = jwt.verify(token, process.env.FORGET_PASSWORD_SECRET);

    const user = await userModel.findOne({ email: email });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.hashPassword(req.body.password);

    const updatePassword = await user.save();

    if (!updatePassword)
      return res.status(500).json({ message: "Failed to update password!" });

    return res.json({ message: "Sucessfully Updated password!" });
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized user" });
  }
};
