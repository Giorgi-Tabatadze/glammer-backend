/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

const deliveries = [...Array(24)].map((_, index) => ({
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  telephone: faker.phone.phoneNumber(),
  city: faker.address.city(),
  address: faker.address.streetAddress(),
}));

console.log(deliveries);

module.exports = deliveries;
