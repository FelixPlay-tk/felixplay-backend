const express = require("express");
const router = express.Router();

const {
    register,
    verifyEmail,
    signInWithEmail,
    verifyJWT,
    changePassword,
    forgotPassword,
    resetPassword,
    resendOTP,
} = require("../controllers/authentication");
const { authorize } = require("../middlewares/authorize");

router.post("/register", register);
router.post("/resendotp", resendOTP);
router.post("/verify", verifyEmail);

router.post("/login", signInWithEmail);
router.post("/authorize", verifyJWT);

router.post("./changepassword", changePassword);
router.post("/forgetpassword", forgotPassword);
router.post("/resetpassword", authorize, resetPassword);

module.exports = router;
