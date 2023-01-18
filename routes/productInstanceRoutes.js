const express = require("express");

const router = express.Router();
const productsInstancesController = require("../controllers/productInstancesController");

router
  .route("/")
  .get(productsInstancesController.getAllProductInstances)
  .post(productsInstancesController.createNewProductInstance)
  .patch(productsInstancesController.updateProductInstance)
  .delete(productsInstancesController.deleteProductInstance);

module.exports = router;
