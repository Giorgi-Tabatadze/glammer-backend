/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const size = ["S", "M", "L"];
const colors = ["black", "white", "red", "blue"];

const orders = [...Array(10)].map((_, index) => {
  const setIndex = index;

  return {
    fundsDeposited: 20,
    differentPrice: undefined,
    status: "tracked",
    userId: randomNumber(1, 8),
    alternativeDeliveryId: index > 7 ? randomNumber(11, 24) : undefined,
  };
});

console.log(orders);

module.exports = orders;
