const express = require("express");
const router = express.Router();

const { addNewMovie } = require("../controllers/movies");

router.put("/add", addNewMovie);

module.exports = router;
