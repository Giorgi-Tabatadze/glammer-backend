const express = require("express");

const router = express.Router();
const deliveriesController = require("../controllers/deliveriesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(deliveriesController.getAllDeliveries)
  .post(deliveriesController.createNewDelivery)
  .patch(deliveriesController.updateDelivery)
  .delete(deliveriesController.deleteDelivery);

module.exports = router;
