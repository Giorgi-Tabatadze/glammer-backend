const express = require("express");

const router = express.Router();
const sqlProductInstacesController = require("../sqlcontrollers/productInstancesController");

router
  .route("/")
  .get(sqlProductInstacesController.getAllProductInstances)
  .post(sqlProductInstacesController.createNewProductInstance)
  .patch(sqlProductInstacesController.updateProductInstance)
  .delete(sqlProductInstacesController.deleteProductInstance);

module.exports = router;
