const express = require("express");

const router = express.Router();
const trackingController = require("../controllers/trackingsController");

router
  .route("/")
  .get(trackingController.getAllTrackings)
  .post(trackingController.createNewTracking)
  .patch(trackingController.updateTracking)
  .delete(trackingController.deleteTracking);

module.exports = router;
