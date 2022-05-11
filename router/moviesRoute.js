const express = require("express");
const router = express.Router();

const { authorize } = require("../middlewares/authorize");
const {
    addNewMovie,
    getMoviesByCategory,
    getSingleMovie,
    getMovieLinks,
    getMovieRows,
    getAllMovieID,
    getFeatured,
} = require("../controllers/movies");

router.put("/add", addNewMovie);

router.get("/all", getAllMovieID);
router.get("/featured", getFeatured);
router.get("/rows", getMovieRows);

router.get("/category/:category", getMoviesByCategory);
router.get("/details/:id", getSingleMovie);
router.get("/links/:id", authorize, getMovieLinks);

module.exports = router;
