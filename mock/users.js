/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

const users = [...Array(10)].map((_, index) => ({
  username: faker.internet.userName(),
  password: "1234",
  role: "customer",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  deliveryId: index + 1,
}));

console.log(users);

module.exports = users;
