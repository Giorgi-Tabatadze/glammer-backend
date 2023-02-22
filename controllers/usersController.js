const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const db = require("../models");
const {
  models: { User, Delivery },
} = require("../models");

// @desc Get all users
// @routes GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 0,
    limit = 20,
    globalfilter,
    columnfilters,
    sorting,
  } = req.query;

  let sortingObject = ["id", "DESC"];

  if (sorting?.length > 2) {
    const parsed = JSON.parse(sorting)[0];
    if (parsed.id.includes(".")) {
      sortingObject = [
        { model: Delivery, as: "delivery" },
        parsed.id.split(".")[1],
        parsed.desc ? "DESC" : "ASC",
      ];
      parsed.id = { model: User, as: "delivery" };
    } else {
      sortingObject = [parsed.id, parsed.desc ? "DESC" : "ASC"];
    }
  }

  let filterObjects = [
    { username: { [Op.iLike]: `${globalfilter}%` } },
    { role: { [Op.iLike]: `${globalfilter}%` } },
    { "$delivery.firstname$": { [Op.iLike]: `${globalfilter}%` } },
    { "$delivery.lastname$": { [Op.iLike]: `${globalfilter}%` } },
    { "$delivery.telephone$": { [Op.iLike]: `${globalfilter}%` } },
    { "$delivery.city$": { [Op.iLike]: `${globalfilter}%` } },
    { "$delivery.address$": { [Op.iLike]: `${globalfilter}%` } },
  ];

  if (columnfilters?.length > 2) {
    filterObjects = [];
    JSON.parse(columnfilters).forEach((filter) => {
      let query;
      if (filter.id === "id") {
        query = {
          [`$user.id$`]: { [Op.eq]: Number(filter.value) },
        };
      } else {
        query = { [`$${filter.id}$`]: { [Op.iLike]: `${filter.value}%` } };
      }
      filterObjects.push(query);
    });
  }

  const offset = page * limit;
  const Users = await User.findAndCountAll({
    limit,
    offset,
    where: {
      [Op.or]: [...filterObjects],
    },
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Delivery,
      },
    ],
    order: [sortingObject],
    // conditions
  });

  return res.json(Users);
});

// @desc Create new user
// @routes POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, role, delivery } = req.body;

  const result = await db.sequelize.transaction(async (t) => {
    const newDelivery = await Delivery.create(
      {
        firstname: delivery?.firstname,
        lastname: delivery?.lastname,
        telephone: delivery?.telephone,
        city: delivery?.city,
        address: delivery?.address,
      },
      { transaction: t },
    );

    await User.create(
      {
        username,
        password: password || "3492",
        role: req.role === "admin" ? role : "customer",
        deliveryId: newDelivery.id,
      },
      { transaction: t },
    );
  });

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
  if (password && req.role === "admin") {
    user.password = password;
  }
  if (req.role === "admin") {
    user.role = role;
  }

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
  const user = await User.findByPk(id);
  if (!id) {
    res.status(400).json({ message: "invalid ID" });
  }

  if (user.deliveryId) {
    const { deliveryId } = user;
    await db.sequelize.transaction(async (t) => {
      await User.destroy(
        {
          where: {
            id,
          },
        },
        { transaction: t },
      );
      await Delivery.destroy(
        {
          where: {
            id: deliveryId,
          },
        },
        { transaction: t },
      );
    });
  } else {
    await user.destroy();
  }
  res.json();
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
