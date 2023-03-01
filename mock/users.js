/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

// const users = [...Array(200)].map((_, index) => ({
//   username: faker.internet.userName(),
//   password: "1234",
//   role: "customer",
//   firstName: faker.name.firstName(),
//   lastName: faker.name.lastName(),
//   deliveryId: index + 1,
// }));
const users = [];
// users.push({
//   username: "test1",
//   password: "123456",
//   role: "customer",
// });
// users.push({
//   username: "test2",
//   password: "123456",
//   role: "employee",
// });
users.push({
  username: "test3",
  password: "123456",
  role: "admin",
});

module.exports = users;
