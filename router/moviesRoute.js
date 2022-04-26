const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");
const {
    addNewMovie,
    getMoviesByLanguage,
    getMoviesByCategory,
    getFeaturedMovies,
    getSingleMovie,
    getMovieLinks,
    getMovieRows,
} = require("../controllers/movies");

router.put("/add", addNewMovie);

router.get("/", getMovieRows);
router.get("/featured", getFeaturedMovies);
router.get("/language/:language", getMoviesByLanguage);
router.get("/category/:category", getMoviesByCategory);
router.get("/details/:id", getSingleMovie);
router.get("/links/:id", authorize, getMovieLinks);

module.exports = router;