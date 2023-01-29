const {
  models: {
    Delivery,
    Order,
    Product,
    ProductInstance,
    Scaccount,
    Tracking,
    User,
  },
} = require("../models");
const Deliveries = require("./deliveries");
const Orders = require("./orders");
const Productinstances = require("./productInstances");
const Products = require("./products");
const Trackings = require("./trackings");
const Scaccounts = require("./scaccounts");
const Users = require("./users");

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const InsertMockData = async () => {
  await Promise.all(
    Deliveries.map(async (delivery) => {
      await Delivery.create(delivery);
    }),
  );
  await Promise.all(
    Products.map(async (product) => {
      await Product.create(product);
    }),
  );
  await Promise.all(
    Scaccounts.map(async (scaccount) => {
      await Scaccount.create(scaccount);
    }),
  );
  await Promise.all(
    Users.map(async (user) => {
      await User.create(user);
    }),
  );
  await Promise.all(
    Trackings.map(async (tracking) => {
      await Tracking.create(tracking);
    }),
  );
  await Promise.all(
    Orders.map(async (order) => {
      await Order.create(order);
    }),
  );
  await Promise.all(
    Productinstances.map(async (productInstance) => {
      await ProductInstance.create({
        ...productInstance,
        orderId: randomNumber(1, 10),
      });
    }),
  );
};

module.exports = InsertMockData;
