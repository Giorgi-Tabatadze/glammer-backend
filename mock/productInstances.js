/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const size = ["S", "M", "L"];
const colors = ["black", "white", "red", "blue"];

const productInstances = [...Array(5000)].map((_, index) => {
  const setIndex = index;

  return {
    ordered: randomNumber(1, 3) === 1,
    size: size[randomNumber(1, 3)],
    color: colors[randomNumber(1, 4)],
    differentPrice: undefined,
    productId: randomNumber(1, 6),
    trackingId: randomNumber(1, 3) === 1 ? undefined : randomNumber(1, 50),
    orderId: randomNumber(1, 1000),
  };
});

module.exports = productInstances;
