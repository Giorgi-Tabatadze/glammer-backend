const express = require("express");

const router = express.Router();
const sqlOrdersController = require("../sqlcontrollers/ordersController");

router
  .route("/")
  .get(sqlOrdersController.getAllOrders)
  .post(sqlOrdersController.createNewOrder)
  .patch(sqlOrdersController.updateOrder)
  .delete(sqlOrdersController.deleteOrder);

module.exports = router;
