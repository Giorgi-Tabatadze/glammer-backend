const express = require("express");

const router = express.Router();
const trackingsController = require("../controllers/trackingsController");

router
  .route("/")
  .get(trackingsController.getAllTrackings)
  .post(trackingsController.createNewTracking)
  .patch(trackingsController.updateTracking)
  .delete(trackingsController.deleteTracking);

module.exports = router;
