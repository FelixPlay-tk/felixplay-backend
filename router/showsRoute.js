const express = require("express");
const router = express.Router();

const {
    addNewShow,
    getEpisodeLinks,
    getSingleShow,
    getShowsByPlatform,
} = require("../controllers/shows");

router.get("/platform/:platform", getShowsByPlatform);
router.get("/details/:id", getSingleShow);
router.get("/episodelinks/:id", getEpisodeLinks);

module.exports = router;
