const express = require("express");
const { register } = require("../controllers/authentication");
const router = express.Router();

router.post("/register", register);
// router.get("/verify", verifyAccount)

module.exports = router;
