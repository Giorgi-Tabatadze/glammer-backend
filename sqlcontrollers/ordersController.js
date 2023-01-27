/* eslint-disable no-plusplus */
const asyncHandler = require("express-async-handler");
const db = require("../sqlmodels");
const {
  models: { Delivery, Order, ProductInstance },
} = require("../sqlmodels");

// @desc Get all Orders
// @routes GET /orders
// @access Private
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const orders = await Order.findAll({
    limit,
    offset,
    where: {}, // conditions
  });
  if (!orders?.length) {
    return res.status(400).json({ message: "no orders found" });
  }
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
      if (!alternativeDelivery.firstname) {
        res.status(400);
        throw new Error("firstname is required");
      }
      if (!alternativeDelivery.lastname) {
        res.status(400);
        throw new Error("lastname is required");
      }
      if (!alternativeDelivery.telephone) {
        res.status(400);
        throw new Error("telephone is required");
      }
      if (!alternativeDelivery.city) {
        res.status(400);
        throw new Error("city is required");
      }
      if (!alternativeDelivery.address) {
        res.status(400);
        throw new Error("address is required");
      }
      alternativeDeliverySaved = await Delivery.create(alternativeDelivery, {
        transaction: t,
      });
    }
    const newOrder = await Order.create(
      {
        userId,
        alternativeDeliveryId: alternativeDeliverySaved?.id,
        fundsDeposited,
        deliveryPrice,
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
            productId: productInstance.productId,
            orderId: newOrder.id,
            ordered: productInstance.ordered,
            size: productInstance.size,
            color: productInstance.color,
            differentPrice: productInstance.differentPrice,
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
      await order.destroy({ transaction: t });
    });
  } else {
    await order.destroy();
  }
  res.json();
});

module.exports = {
  getAllOrders,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
