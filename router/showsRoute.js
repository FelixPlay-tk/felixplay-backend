const express = require("express");
const router = express.Router();

const {
    addNewShow,
    getEpisodeLinks,
    getSingleShow,
    getShowsByPlatform,
    getAllShows,
    getAllShowsID,
} = require("../controllers/shows");
const { authorize } = require("../middlewares/authorize");

router.put("/add", addNewShow);
router.get("/all", getAllShows);
router.get("/paths", getAllShowsID);
router.get("/platform/:platform", getShowsByPlatform);
router.get("/details/:id", getSingleShow);
router.get("/episodelinks/:id", authorize, getEpisodeLinks);

module.exports = router;
