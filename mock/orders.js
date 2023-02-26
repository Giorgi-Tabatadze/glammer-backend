/* eslint-disable no-unused-vars */
const { faker } = require("@faker-js/faker");

// ----------------------------------------------------------------------

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const size = ["S", "M", "L"];
const colors = ["black", "white", "red", "blue"];

const orders = [...Array(1000)].map((_, index) => {
  const setIndex = index;

  return {
    fundsDeposited: 20,
    differentPrice: undefined,
    // status is either "created", "ordered", "tracked" or "sent" or "delivered" or "other" or "canceled"
    status: ["created", "delivered", "other", "canceled"][randomNumber(0, 4)],
    userId: randomNumber(1, 8),
    alternativeDeliveryId: index > 200 ? index : undefined,
    customerNote:
      "Please make it fast or I will sue you and put you in jail! you mathafakakakakakakaka",
    staffNote:
      "Please make sure that this person gets order as fast as possible or she will sue and put is in jail. she said we are muthjafukakakakakakakakaks...",
  };
});

module.exports = orders;
