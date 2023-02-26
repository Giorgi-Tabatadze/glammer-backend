const asyncHandler = require("express-async-handler");
const db = require("../models");
const {
  models: { Delivery, Order, ProductInstance, Tracking, Product, User },
} = require("../models");

// @desc Get all Orders
// @routes GET /orders
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const { publicId } = req.query;

  const user = await User.findOne({
    where: { publicId, role: "customer" },
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Delivery,
        required: false,
      },
    ],
  });

  res.json(user);
});

const updateDelivery = asyncHandler(async (req, res) => {
  const { id, firstname, lastname, telephone, city, address, publicId } =
    req.body;

  const user = await User.findOne({
    where: { publicId, role: "customer" },
  });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  // eslint-disable-next-line eqeqeq
  if (user.deliveryId !== id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const delivery = await Delivery.findByPk(id);

  if (!delivery) {
    return res.status(400).json({ message: "delivery not found" });
  }
  delivery.firstname = firstname;
  delivery.lastname = lastname;
  delivery.telephone = telephone;
  delivery.city = city;
  delivery.address = address;

  await delivery.save();

  res.status(200).json();
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { page = 0, limit = 20, publicId } = req.query;

  const user = await User.findOne({
    where: { publicId, role: "customer" },
  });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  const offset = page * limit;

  const sortingObject = ["id", "DESC"];

  const orders = await Order.findAndCountAll({
    distinct: true,
    limit,
    offset,
    where: { userId: user.id },
    include: [
      {
        model: ProductInstance,
        required: false,
        include: [
          {
            model: Tracking,
            required: false,
          },
          {
            model: Product,
            required: false,
          },
        ],
      },
      {
        model: Delivery,
        required: false,
      },
    ],
    order: [sortingObject],
  });

  res.json(orders);
});

const updateAlternativeDelivery = asyncHandler(async (req, res) => {
  const { id, publicId, alternativeDelivery } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  if (!publicId) {
    return res.status(400).json({ message: "publicId is required" });
  }

  const order = await Order.findByPk(id);

  if (!order) {
    return res.status(400).json({ message: "order not found" });
  }

  const user = await User.findOne({
    where: { publicId, role: "customer" },
  });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  if (order.userId !== user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (alternativeDelivery === null && order.alternativeDeliveryId) {
    await db.sequelize.transaction(async (t) => {
      await Delivery.destroy(
        {
          where: {
            id: order.alternativeDeliveryId,
          },
        },
        { transaction: t },
      );
      order.alternativeDeliveryId = null;
      await order.save({ transaction: t });
    });
  } else if (alternativeDelivery) {
    if (order.alternativeDeliveryId) {
      await Delivery.update(alternativeDelivery, {
        where: {
          id: order.alternativeDeliveryId,
        },
      });
    } else {
      const newAlternativeDelivery = await Delivery.create(alternativeDelivery);
      order.alternativeDeliveryId = newAlternativeDelivery.id;
      await order.save();
    }
  } else {
    await order.save();
  }

  res.json();
});

module.exports = {
  getUser,
  getUserOrders,
  updateDelivery,
  updateAlternativeDelivery,
};
