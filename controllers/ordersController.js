/* eslint-disable no-plusplus */
const asyncHandler = require("express-async-handler");
const _ = require("lodash");
const db = require("../models");
const getOrderColumnFilters = require("./util/getOrderColumnFilters");
const {
  models: { Delivery, Order, ProductInstance, Tracking, Product, User },
} = require("../models");
const getOrderColumnSorting = require("./util/getOrderColumnSorting");

// @desc Get all Orders
// @routes GET /orders
// @access Private
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 0, limit = 20, columnfilters, sorting } = req.query;

  const offset = page * limit;

  const sortingObject = getOrderColumnSorting(sorting);

  const where = getOrderColumnFilters(columnfilters);

  const orders = await Order.findAndCountAll({
    distinct: true,
    limit,
    offset,
    where: where.orderWhere,
    include: [
      {
        model: User,
        as: "user",
        required: true,
        where: where.userWhere,
        include: [
          {
            model: Delivery,
            required: false,
          },
        ],
      },
      {
        model: ProductInstance,
        as: "productinstances",
        required: false,
        where: where.productInstanceWhere,
        include: [
          {
            model: Tracking,
            required: where.trackingRequired,
            where: where.trackingWhere,
          },
          {
            model: Product,
            required: where.productRequired,
            where: where.productWhere,
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

// @desc Create new Order
// @routes POST /orders
// @access Private
const createNewOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    productInstances,
    alternativeDelivery,
    fundsDeposited,
    deliveryPrice,
    status,
    customerNote,
    staffNote,
  } = req.body;

  const result = await db.sequelize.transaction(async (t) => {
    if (!productInstances?.length) {
      return res.status(400).json({ message: "productInstaces is required" });
    }
    let alternativeDeliverySaved = null;
    if (alternativeDelivery) {
      alternativeDeliverySaved = await Delivery.create(alternativeDelivery, {
        transaction: t,
      });
    }
    const newOrder = await Order.create(
      {
        userId,
        alternativeDeliveryId: alternativeDeliverySaved?.id,
        fundsDeposited: parseFloat(fundsDeposited),
        deliveryPrice: parseFloat(deliveryPrice),
        status,
        customerNote,
        staffNote,
      },
      { transaction: t },
    );
    await Promise.all(
      productInstances.map(async (productInstance) => {
        await ProductInstance.create(
          {
            productId: productInstance?.productId,
            orderId: newOrder.id,
            ordered: productInstance?.ordered,
            size: productInstance?.size,
            color: productInstance?.color,
            differentPrice: parseFloat(productInstance?.differentPrice) || null,
          },
          { transaction: t },
        );
      }),
    );
  });

  res.status(201).json();
});

// @desc Update a Order
// @routes PATCH /orders
// @access Private
const updateOrder = asyncHandler(async (req, res) => {
  const {
    id,
    userId,
    alternativeDelivery,
    fundsDeposited,
    deliveryPrice,
    status,
    customerNote,
    staffNote,
  } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const order = await Order.findByPk(id);

  if (!order) {
    return res.status(400).json({ message: "order not found" });
  }
  if (userId) {
    order.userId = userId;
  }
  order.fundsDeposited = fundsDeposited;
  order.deliveryPrice = deliveryPrice;
  order.status = status;
  order.customerNote = customerNote;
  order.staffNote = staffNote;
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
      await order.save({ transaction: t });
    });
  } else if (alternativeDelivery) {
    if (order.alternativeDeliveryId) {
      await db.sequelize.transaction(async (t) => {
        await Delivery.update(
          alternativeDelivery,
          {
            where: {
              id: order.alternativeDeliveryId,
            },
          },
          { transaction: t },
        );
        await order.save({ transaction: t });
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

// @desc Delete a Order
// @routes Delete /orders
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "order ID Required" });
  }
  const order = await Order.findByPk(id);
  if (!order) {
    return res.status(400).json({ message: "order not found" });
  }
  if (order.alternativeDeliveryId) {
    await db.sequelize.transaction(async (t) => {
      await Delivery.destroy(
        {
          where: {
            id: order.alternativeDeliveryId,
          },
        },
        { transaction: t },
      );
      await ProductInstance.destroy(
        {
          where: {
            id: order.id,
          },
        },
        { transaction: t },
      );
      await order.destroy({ transaction: t });
    });
    res.status(200);
  } else {
    await db.sequelize.transaction(async (t) => {
      await ProductInstance.destroy(
        {
          where: {
            id: order.id,
          },
        },
        { transaction: t },
      );
      await order.destroy({ transaction: t });
    });
    res.status(200);
  }
  res.json();
});

module.exports = {
  getAllOrders,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
