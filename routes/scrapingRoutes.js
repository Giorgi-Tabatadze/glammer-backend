const express = require("express");

const router = express.Router();

const verifySecretToken = require("../middleware/verifySecretToken");
const scrapingsController = require("../controllers/scrapingsController");

router.use(verifySecretToken);

router.route("/").patch(scrapingsController.updateTrackingsFromScrapedData);

module.exports = router;
