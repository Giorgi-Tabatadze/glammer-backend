/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");
const sharp = require("sharp");

// ----------------------------------------------------------------------

const versions = [
  { width: 750, height: 750, suffix: "large" },
  { width: 300, height: 300, suffix: "medium" },
  { width: 150, height: 150, suffix: "small" },
];

const path = `./public/images/products/`;

const products = [...Array(6)].map((_, index) => {
  versions.map(async (version) => {
    sharp(`${path}/${index + 1}.jpg`)
      .resize(version.width, version.height)
      .toFile(`${path}/${version.suffix}/${index + 1}.jpg`);
  });

  return {
    price: 45,
    taobaoPrice: 10,
    role: "customer",
  };
});

module.exports = products;
