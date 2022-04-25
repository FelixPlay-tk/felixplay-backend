const express = require("express");
const router = express.Router();
const {
    getMoviesCategory,
    getShowsCategory,
    getAnimesCategory,
    createMoviesCategory,
    createShowsCategory,
    createAnimesCategory,
} = require("../controllers/categories");

router.get("/movies", getMoviesCategory);
router.get("/shows", getShowsCategory);
router.get("/animes", getAnimesCategory);

router.put("/movies", createMoviesCategory);
router.put("/shows", createShowsCategory);
router.put("/animes", createAnimesCategory);

module.exports = router;
