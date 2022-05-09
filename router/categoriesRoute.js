const express = require("express");
const router = express.Router();
const {
    getMoviesCategory,
    getShowsCategory,
    createMoviesCategory,
    createShowsCategory,
} = require("../controllers/categories");

router.get("/movies", getMoviesCategory);
router.get("/shows", getShowsCategory);

router.put("/movies", createMoviesCategory);
router.put("/shows", createShowsCategory);

module.exports = router;
