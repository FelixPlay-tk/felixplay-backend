const express = require("express");
const router = express.Router();

const {
    register,
    verifyEmail,
    resendVerificationLink,
} = require("../controllers/authentication");

router.post("/register", register);
router.post("/resendverificationlink", resendVerificationLink);
router.get("/verify", verifyEmail);

module.exports = router;
