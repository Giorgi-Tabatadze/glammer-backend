const express = require("express");
const upload = require("../middleware/multerUpload");

const router = express.Router();
const productController = require("../controllers/productsController");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(upload, productController.createNewProduct)
  .patch(upload, productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
