const {
  models: { ProductInstance, Tracking, Product },
} = require("../../models");

const getOrderColumnSorting = (sorting) => {
  let sortingObject = ["id", "DESC"];

  if (sorting?.length > 2) {
    const parsed = JSON.parse(sorting)[0];
    if (parsed.id.includes(".")) {
      // split parsed id by dot
      const split = parsed.id.split(".");
      console.log(split);
      if (split[0] === "productinstance") {
        sortingObject = [
          { model: ProductInstance },
          split[1],
          parsed.desc ? "DESC" : "ASC",
        ];
      } else if (split[0] === "tracking") {
        sortingObject = [
          { model: ProductInstance },
          { model: Tracking },
          split[1],
          parsed.desc ? "DESC" : "ASC",
        ];
      } else if (split[0] === "product") {
        sortingObject = [
          { model: ProductInstance },
          { model: Product },
          split[1],
          parsed.desc ? "DESC" : "ASC",
        ];
      }
    } else if (parsed.id === "orderId") {
      sortingObject = ["id", parsed.desc ? "DESC" : "ASC"];
    } else {
      sortingObject = [
        { model: ProductInstance },
        parsed.id,
        parsed.desc ? "DESC" : "ASC",
      ];
    }
  }
  console.log(sortingObject);

  return sortingObject;
};
module.exports = getOrderColumnSorting;
