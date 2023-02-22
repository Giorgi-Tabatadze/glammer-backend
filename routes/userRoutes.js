const express = require("express");

const router = express.Router();
const usersController = require("../controllers/usersController");

const checkAdmin = require("../middleware/checkAdmin");

const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(checkAdmin, usersController.deleteUser);

module.exports = router;
