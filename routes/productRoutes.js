const express = require("express");
const upload = require("../middleware/multerUpload");

const router = express.Router();
const productController = require("../controllers/productsController");
const checkAdmin = require("../middleware/checkAdmin");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(upload.single("photo"), checkAdmin, productController.createNewProduct)
  .patch(upload.single("photo"), checkAdmin, productController.updateProduct)
  .delete(checkAdmin, productController.deleteProduct);

module.exports = router;
