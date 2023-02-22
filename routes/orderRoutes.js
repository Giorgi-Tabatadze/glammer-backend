const express = require("express");

const router = express.Router();
const ordersController = require("../controllers/ordersController");

const checkAdmin = require("../middleware/checkAdmin");

const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(ordersController.getAllOrders)
  .post(ordersController.createNewOrder)
  .patch(ordersController.updateOrder)
  .delete(checkAdmin, ordersController.deleteOrder);

module.exports = router;
