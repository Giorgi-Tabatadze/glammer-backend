/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

const scaccounts = [...Array(5)].map((_, index) => ({
  email: faker.internet.email(),
  lastName: faker.name.lastName(),
  username: faker.internet.userName(),
  company: "spacecargo",
  password: "1234",
}));

console.log(scaccounts);

module.exports = scaccounts;
