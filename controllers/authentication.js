const userModel = require("../model/userModel");
const { sendVerificationLink } = require("../config/mail");
const { equals } = require("validator");

exports.register = async (req, res) => {
    if (
        !req.body.firstname ||
        !req.body.lastname ||
        !req.body.email ||
        !req.body.email ||
        !req.body.password ||
        !req.body.confirmPassword
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!equals(req.body.password, req.body.confirmPassword)) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const checkExist = await userModel.findOne({ email: req.body.email });

        if (checkExist)
            return res
                .status(400)
                .json({ message: "Email already registered!" });

        // initialize user model
        const newUser = new userModel({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
        });

        // generating password hash
        await newUser.hashPassword(req.body.password);

        // generating verification Token
        await newUser.generateToken();

        // attempting to save on db
        const saveUser = await newUser.save();

        if (!saveUser)
            return res
                .status(400)
                .json({ message: "Oops! Something went wrong" });

        return res.status(201).json({
            message: "Please check your email inbox to verify your account",
        });
    } catch (error) {
        return res.status(500).json({ message: "Oops! Something went wrong" });
    }
};
