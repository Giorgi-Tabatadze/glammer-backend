const express = require("express");

const router = express.Router();
const sqlUsersController = require("../sqlcontrollers/usersController");

router
  .route("/")
  .get(sqlUsersController.getAllUsers)
  .post(sqlUsersController.createNewUser)
  .patch(sqlUsersController.updateUser)
  .delete(sqlUsersController.deleteUser);

module.exports = router;
