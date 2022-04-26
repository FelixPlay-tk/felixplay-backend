const express = require("express");
const router = express.Router();

const {
    addNewMovie,
    getMoviesByLanguage,
    getMoviesByCategory,
    getFeaturedMovies,
    getSingleMovie,
} = require("../controllers/movies");

router.put("/add", addNewMovie);

router.get("/language/:language", getMoviesByLanguage);
router.get("/category/:category", getMoviesByCategory);

router.get("/getfeatured", getFeaturedMovies);
router.get("/details/:id", getSingleMovie);

module.exports = router;
