const express = require("express");

const router = express.Router();
const productInstacesController = require("../controllers/productInstancesController");

const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(productInstacesController.getAllProductInstances)
  .post(productInstacesController.createNewProductInstance)
  .patch(productInstacesController.updateProductInstance)
  .delete(productInstacesController.deleteProductInstance);

module.exports = router;
