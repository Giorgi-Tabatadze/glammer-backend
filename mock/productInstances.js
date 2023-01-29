/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const size = ["S", "M", "L"];
const colors = ["black", "white", "red", "blue"];

const productInstances = [...Array(30)].map((_, index) => {
  const setIndex = index;

  return {
    ordered: true,
    size: size[randomNumber(1, 3)],
    color: colors[randomNumber(1, 4)],
    differentPrice: undefined,
    productId: randomNumber(1, 6),
    trackingId: randomNumber(1, 6),
  };
});

console.log(productInstances);

module.exports = productInstances;
