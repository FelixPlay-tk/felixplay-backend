const userModel = require("../model/userModel");
const { sendVerificationLink } = require("../config/mail");
const { equals, isEmail } = require("validator");

exports.register = async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body;

    if (!firstname || !lastname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!isEmail(email))
        return res.json({ message: "Please provide valid email address" });

    if (!equals(password, confirmPassword)) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const checkExist = await userModel.findOne({ email: email });

        if (checkExist)
            return res
                .status(400)
                .json({ message: "Email already registered!" });

        // initialize user model
        const newUser = new userModel({ firstname, lastname, email });

        // generating password hash
        newUser.hashPassword(password);

        // generating verification Token
        await newUser.generateToken();

        // attempting to save on db
        const saveUser = await newUser.save();

        if (!saveUser)
            return res
                .status(400)
                .json({ message: "Oops! Something went wrong" });

        sendVerificationLink(saveUser.email, saveUser.verificationToken)
            .then((result) => console.log(result))
            .catch((err) => console.log(err.message));

        return res.status(201).json({
            message: "Please check your email inbox to verify your account",
        });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};

exports.resendVerificationLink = async (req, res) => {
    const { email } = req.body;

    if (!isEmail(email))
        return res.json({ message: "Please provide valid email address" });

    try {
        const user = await userModel.findOne({ email });

        if (!user) return res.status(400).json({ message: "No user found!" });

        if (user.verified)
            return res.status(400).json({ message: "User already verified" });

        csendVerificationLink(user.email, user.verificationToken);

        res.json({
            message: "Please check your email inbox to verify your account",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Oops! Something went wrong",
            error: error.message,
        });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token, email } = req.query;

    if (!token || !email)
        return res.status(400).json({ message: "all fields are required" });

    if (!isEmail(email))
        return res.json({ message: "Please provide valid email address" });

    try {
        const user = await userModel.findOne({ email: email });

        if (!user) return res.status(400).json({ message: "User not found!" });

        if (user.verified)
            return res.status(400).json({ message: "User already verified!" });

        if (user.verificationToken !== token)
            return res.status(400).jsob({ message: "Invalid token" });

        const updateUser = await userModel.updateOne(
            { email: user.email },
            {
                $set: {
                    verified: true,
                },
                $unset: {
                    verificationToken: null,
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
