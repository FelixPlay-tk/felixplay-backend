const express = require("express");
const router = express.Router();

const {
    register,
    verifyEmail,
    resendVerificationLink,
    signInWithEmail,
    verifyJWT,
} = require("../controllers/authentication");

router.post("/register", register);
router.post("/resendverificationlink", resendVerificationLink);
router.get("/verify", verifyEmail);

router.post("/login", signInWithEmail);
router.post("/verifyjwt", verifyJWT);

module.exports = router;
