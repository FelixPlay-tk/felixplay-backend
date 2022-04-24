const express = require("express");
const router = express.Router();

const {
    register,
    verifyEmail,
    resendVerificationLink,
    signInWithEmail,
    verifyJWT,
    changePassword,
    forgotPassword,
    resetPassword,
} = require("../controllers/authentication");
const { authorize } = require("../middlewares/authorize");

router.post("/register", register);
router.post("/resendverificationlink", resendVerificationLink);
router.get("/verify", verifyEmail);

router.post("/login", signInWithEmail);
router.post("/authorize", verifyJWT);

router.post("./changepassword", changePassword);
router.post("/forgetpassword", forgotPassword);
router.post("/resetpassword", authorize, resetPassword);

module.exports = router;
