/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

const scaccounts = [...Array(5)].map((_, index) => ({
  username: faker.internet.email(),
  company: "spacecargo.com",
  password: "1234",
}));

module.exports = scaccounts;
