/* eslint-disable no-plusplus */
const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const ProductInstance = require("../models/ProductInstance");
const User = require("../models/User");

/// UTIL
function hasDuplicates(array) {
  const valuesSoFar = Object.create(null);
  for (let i = 0; i < array.length; ++i) {
    const value = array[i];
    if (value in valuesSoFar) {
      return true;
    }
    valuesSoFar[value] = true;
  }
  return false;
}
// @desc Get all Orders
// @routes GET /orders
// @access Private
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const orders = await Order.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
  if (!orders?.length) {
    return res.status(400).json({ message: "No orders found" });
  }
  res.json(orders);
});

// @desc Create new Order
// @routes POST /orders
// @access Private
const createNewOrder = asyncHandler(async (req, res) => {
  const {
    user,
    productinstances,
    fundsdeposited,
    firstname,
    lastname,
    telephone,
    city,
    address,
    customernote,
    staffnote,
  } = req.body;

  /// /  VALIDATION START  ///////////////////////////

  if (!fundsdeposited) {
    return res.status(400).json({
      message: "Funds deposited is required",
    });
  }

  if (!user) {
    return res.status(400).json({
      message: "Client-User is required to create Order",
    });
  }
  const foundUser = await User.findById(user).exec();

  if (!foundUser) {
    return res.status(400).json({
      message: "Invalid User ID",
    });
  }

  if (!productinstances?.length) {
    return res.status(400).json({
      message: "Product Instances are required to create order",
    });
  }
  if (hasDuplicates(productinstances)) {
    return res.status(400).json({
      message: "Product Instances have duplicate values",
    });
  }

  /// Make sure productIntance ids are valid
  const productInstancesFound = [];
  const ordersWithSameProductInstance = [];
  await Promise.all(
    productinstances.map(async (productInstance) => {
      const productInstanceFound = await ProductInstance.findOne({
        _id: productInstance,
      }).exec();
      const OrderFound = await Order.findOne({
        productinstances: productInstance,
      }).exec();
      productInstancesFound.push(productInstanceFound);
      ordersWithSameProductInstance.push(OrderFound);
    }),
  );
  const invalidProductInstance = productInstancesFound.some(
    (productInstance) => !productInstance,
  );
  const instanceUsedInDifferentOrder = ordersWithSameProductInstance.some(
    (foundOrder) => foundOrder,
  );
  if (invalidProductInstance) {
    return res.status(400).json({
      message: "Invalid ProductInstance id provided",
    });
  }
  if (instanceUsedInDifferentOrder) {
    return res.status(400).json({
      message: "ProductInstance provided has been used in a different order",
    });
  }

  /// /  VALIDATION END  ///////////////////////////

  /// / CREATE ORDER OBJECT
  const orderObject = {};

  orderObject.user = user;
  orderObject.productinstances = productinstances;
  orderObject.fundsdeposited = fundsdeposited;
  orderObject.customernote = customernote;
  orderObject.staffnote = staffnote;

  if (firstname) {
    if (foundUser?.firstname) {
      if (foundUser?.firstname.toLowerCase() !== firstname.toLowerCase()) {
        orderObject.firstname = firstname;
      }
    } else {
      foundUser.firstname = firstname;
    }
  }
  if (lastname) {
    if (foundUser?.lastname) {
      if (foundUser?.lastname.toLowerCase() !== lastname.toLowerCase()) {
        orderObject.lastname = lastname;
      }
    } else {
      foundUser.lastname = lastname;
    }
  }
  if (telephone) {
    if (foundUser?.telephone) {
      if (foundUser?.telephone !== telephone) {
        orderObject.telephone = telephone;
      }
    } else {
      foundUser.telephone = telephone;
    }
  }
  if (city) {
    if (foundUser?.city) {
      if (foundUser?.city.toLowerCase() !== city.toLowerCase()) {
        orderObject.city = city;
      }
    } else {
      foundUser.city = city;
    }
  }
  if (address) {
    if (foundUser?.address) {
      if (foundUser?.address.toLowerCase() !== address.toLowerCase()) {
        orderObject.address = address;
      }
    } else {
      foundUser.address = address;
    }
  }

  // create and store new Order

  await foundUser.save().exec();
  const order = await Order.create(orderObject).exec();

  if (order) {
    // Created
    res.status(201).json({ message: `New Order created` });
  } else {
    res.status(400).json({ message: "Invalid Order data received" });
  }
});

// @desc Update a Order
// @routes PATCH /orders
// @access Private
const updateOrder = asyncHandler(async (req, res) => {
  const {
    id,
    user,
    productinstances,
    fundsdeposited,
    firstname,
    lastname,
    telephone,
    city,
    address,
    customernote,
    staffnote,
  } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const order = await Order.findById(id).exec();

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  let foundUser;

  if (user) {
    foundUser = await User.findById(user).exec();

    if (!foundUser) {
      return res.status(400).json({
        message: "Invalid User ID",
      });
    }
    order.user = user;
  } else {
    foundUser = await User.findById(order.user.toString()).exec();
  }
  if (productinstances) {
    if (hasDuplicates(productinstances)) {
      return res.status(400).json({
        message: "Product Instances have duplicate values",
      });
    }
    const productInstancesFound = [];
    const ordersWithSameProductInstance = [];
    await Promise.all(
      productinstances.map(async (productInstance) => {
        const productInstanceFound = await ProductInstance.findOne({
          _id: productInstance,
        }).exec();
        let OrderFound = await Order.findOne({
          productinstances: productInstance,
        }).exec();
        if (OrderFound?._id.toString() === id) {
          OrderFound = false;
        }
        productInstancesFound.push(productInstanceFound);
        ordersWithSameProductInstance.push(OrderFound);
      }),
    );
    const invalidProductInstance = productInstancesFound.some(
      (productInstance) => !productInstance,
    );
    const instanceUsedInDifferentOrder = ordersWithSameProductInstance.some(
      (foundOrder) => foundOrder,
    );
    if (invalidProductInstance) {
      return res.status(400).json({
        message: "Invalid ProductInstance id provided",
      });
    }
    if (instanceUsedInDifferentOrder) {
      return res.status(400).json({
        message: "ProductInstance provided has been used in a different order",
      });
    }

    order.productinstances = productinstances;
  }
  if (fundsdeposited) {
    order.fundsdeposited = fundsdeposited;
  }
  if (firstname) {
    if (foundUser?.firstname) {
      if (foundUser?.firstname.toLowerCase() !== firstname.toLowerCase()) {
        order.firstname = firstname;
      } else {
        order.firstname = undefined;
      }
    } else {
      foundUser.firstname = firstname;
    }
  }
  if (lastname) {
    if (foundUser?.lastname) {
      if (foundUser?.lastname.toLowerCase() !== lastname.toLowerCase()) {
        order.lastname = lastname;
      } else {
        order.lastname = undefined;
      }
    } else {
      foundUser.lastname = lastname;
    }
  }
  if (telephone) {
    if (foundUser?.telephone) {
      if (foundUser?.telephone !== telephone) {
        order.telephone = telephone;
      } else {
        order.telephone = undefined;
      }
    } else {
      foundUser.telephone = telephone;
    }
  }
  if (city) {
    if (foundUser?.city) {
      if (foundUser?.city.toLowerCase() !== city.toLowerCase()) {
        order.city = city;
      } else {
        order.city = undefined;
      }
    } else {
      foundUser.city = city;
    }
  }
  if (address) {
    if (foundUser?.address) {
      if (foundUser?.address.toLowerCase() !== address.toLowerCase()) {
        order.address = address;
      } else {
        order.address = undefined;
      }
    } else {
      foundUser.address = address;
    }
  }

  order.customernote = customernote;
  order.staffnote = staffnote;

  await foundUser.save();
  await order.save();

  res.json({ message: `Order Updated` });
});

// @desc Delete a Order
// @routes Delete /orders
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Order ID Required" });
  }

  const order = await Order.findById(id).exec();

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  const result = await order.deleteOne();

  const reply = `Order with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllOrders,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
