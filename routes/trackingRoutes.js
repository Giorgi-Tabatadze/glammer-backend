const express = require("express");

const router = express.Router();
const sqlTrackingController = require("../sqlcontrollers/trackingsController");

router
  .route("/")
  .get(sqlTrackingController.getAllTrackings)
  .post(sqlTrackingController.createNewTracking)
  .patch(sqlTrackingController.updateTracking)
  .delete(sqlTrackingController.deleteTracking);

module.exports = router;
