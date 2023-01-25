const express = require("express");

const router = express.Router();
const scaccountsController = require("../sqlcontrollers/scaccountsController");

router
  .route("/")
  .get(scaccountsController.getAllScaccounts)
  .post(scaccountsController.createNewScaccount)
  .patch(scaccountsController.updateScaccount)
  .delete(scaccountsController.deleteScaccount);

module.exports = router;
