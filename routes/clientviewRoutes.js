const express = require("express");

const router = express.Router();
const clientViewsController = require("../controllers/clientviewsController");

router.route("/users").get(clientViewsController.getUser);
router.route("/orders").get(clientViewsController.getUserOrders);
router.route("/delivery").patch(clientViewsController.updateDelivery);
router
  .route("/alternativedeliverys")
  .patch(clientViewsController.updateAlternativeDelivery);

module.exports = router;
