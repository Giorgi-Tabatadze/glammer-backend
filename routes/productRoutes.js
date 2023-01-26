const express = require("express");
const upload = require("../middleware/multerUpload");

const router = express.Router();
const sqlProdoctController = require("../sqlcontrollers/productsController");

router
  .route("/")
  .get(sqlProdoctController.getAllProducts)
  .post(upload, sqlProdoctController.createNewProduct)
  .patch(upload, sqlProdoctController.updateProduct)
  .delete(sqlProdoctController.deleteProduct);

module.exports = router;
