const express = require("express");
const upload = require("../middleware/multerUpload");

const router = express.Router();
const sqlProductController = require("../sqlcontrollers/productsController");

router
  .route("/")
  .get(sqlProductController.getAllProducts)
  .post(upload, sqlProductController.createNewProduct)
  .patch(upload, sqlProductController.updateProduct)
  .delete(sqlProductController.deleteProduct);

module.exports = router;
