const express = require("express");

const router = express.Router();
const scaccountsController = require("../controllers/scaccountsController");
const checkAdmin = require("../middleware/checkAdmin");

const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(checkAdmin, scaccountsController.getAllScaccounts)
  .post(checkAdmin, scaccountsController.createNewScaccount)
  .patch(checkAdmin, scaccountsController.updateScaccount)
  .delete(checkAdmin, scaccountsController.deleteScaccount);

module.exports = router;
