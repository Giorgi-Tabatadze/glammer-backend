const express = require("express");

const router = express.Router();
const deliveriesController = require("../sqlcontrollers/deliveriesController");

router
  .route("/")
  .get(deliveriesController.getAllDeliveries)
  .post(deliveriesController.createNewDelivery)
  .patch(deliveriesController.updateDelivery)
  .delete(deliveriesController.deleteDelivery);

module.exports = router;
