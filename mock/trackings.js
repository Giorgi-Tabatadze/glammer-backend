/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const productCodes = ["დეკლარირებული", "სერვის ცენტრში", "გამოგზავნილი"];

const trackings = [...Array(6)].map((_, index) => {
  const setIndex = index;

  return {
    trackingCode: faker.random.numeric(14),
    status: productCodes[index],
    declared: !!productCodes[index],
    declaredFunds: 20,
    sentDate: productCodes[index]
      ? faker.date.between(
          "2023-01-01T00:00:00.000Z",
          "2023-25-01T00:00:00.000Z",
        )
      : undefined,
    estimatedArrival: productCodes[index]
      ? faker.date.between(
          "2023-25-01T00:00:00.000Z",
          "2023-30-01T00:00:00.000Z",
        )
      : undefined,
    taobaoPrice: 10,
    role: "customer",
    scaccountId: randomNumber(1, 4),
  };
});

console.log(trackings);

module.exports = trackings;
