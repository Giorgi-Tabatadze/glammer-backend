const express = require("express");

const router = express.Router();
const productsInstancesController = require("../controllers/productInstancesController");
const sqlProductInstacesController = require("../sqlcontrollers/productInstancesController");

router
  .route("/")
  .get(sqlProductInstacesController.getAllProductInstances)
  .post(productsInstancesController.createNewProductInstance)
  .patch(productsInstancesController.updateProductInstance)
  .delete(productsInstancesController.deleteProductInstance);

module.exports = router;
