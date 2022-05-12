const express = require("express");
const router = express.Router();
const {
    getFeatured,
    getContentRows,
} = require("../controllers/browseFeatured");

router.get("/featured", getFeatured);
router.get("/rows", getContentRows);

module.exports = router;
