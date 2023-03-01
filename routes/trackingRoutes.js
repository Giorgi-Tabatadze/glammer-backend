const express = require("express");

const router = express.Router();
const trackingController = require("../controllers/trackingsController");
const verifyJWT = require("../middleware/verifyJWT");

const checkAdmin = require("../middleware/checkAdmin");

router.use(verifyJWT);

router
  .route("/")
  .get(checkAdmin, trackingController.getAllTrackings)
  .post(checkAdmin, trackingController.createNewTracking)
  .patch(checkAdmin, trackingController.updateTracking)
  .delete(checkAdmin, trackingController.deleteTracking);

router
  .route("/startscrape")
  .patch(checkAdmin, trackingController.startTrackingUpdateProcess);
module.exports = router;
