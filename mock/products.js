/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

const productCodes = ["2241", "2662", "2551", "6634", "5112", "5671"];

const products = [...Array(6)].map((_, index) => {
  const setIndex = index;

  return {
    productCode: productCodes[setIndex],
    thumbnail: `${setIndex + 1}.jpg`,
    price: 45,
    taobaoPrice: 10,
    role: "customer",
  };
});

module.exports = products;
