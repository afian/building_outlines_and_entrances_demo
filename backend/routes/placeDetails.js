const express = require("express");
const { getPlaceDetails } = require("../controllers/placeController");
const router = express.Router();

router.get("/", getPlaceDetails);

module.exports = router;
