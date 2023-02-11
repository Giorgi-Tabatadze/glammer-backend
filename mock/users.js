/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

const users = [...Array(200)].map((_, index) => ({
  username: faker.internet.userName(),
  password: "1234",
  role: "customer",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  deliveryId: index + 1,
}));

module.exports = users;
