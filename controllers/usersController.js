const asyncHandler = require("express-async-handler");
const db = require("../models");
const {
  models: { User, Delivery },
} = require("../models");

// @desc Get all users
// @routes GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const Users = await User.findAll({
    limit,
    offset,
    where: {},
    attributes: { exclude: ["password"] },
    // conditions
  });
  if (!Users?.length) {
    return res.status(400).json({ message: "no users found" });
  }
  return res.json(Users);
});

// @desc Create new user
// @routes POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  const result = await db.sequelize.transaction(async (t) => {
    const delivery = await Delivery.create({}, { transaction: t });

    await User.create(
      {
        username,
        password,
        role,
        deliveryId: delivery.id,
      },
      { transaction: t },
    );
  });

  console.log(result);

  res.status(201).json();
});

// @desc Update a user
// @routes PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, role } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  user.username = username;
  if (password) {
    user.password = password;
  }
  user.role = role;

  await user.save();

  res.json();
});

// @desc Delete a user
// @routes Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "user ID Required" });
  }
  const result = await User.destroy({
    where: {
      id,
    },
  });
  if (!result) {
    res.status(204);
  } else {
    res.status(200);
  }
  res.json();
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
