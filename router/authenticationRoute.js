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

router.post("/signup", register);
router.post("/resendotp", resendOTP);
router.post("/verifyemail", verifyEmail);

router.post("/login", signInWithEmail);
router.post("/authorize", verifyJWT);
router.post("/changepassword", authorize, changePassword);

router.post("/forgetpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

module.exports = router;
