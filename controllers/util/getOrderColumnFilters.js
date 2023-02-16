const { Op } = require("sequelize");

const getOrderColumnFilters = (columnfilters) => {
  const orderFilter = [];
  const productInstanceFilter = [];
  const trackingFilter = [];
  const productFilter = [];
  const userFilter = [];

  if (columnfilters?.length > 2) {
    JSON.parse(columnfilters).forEach((filter) => {
      let query;
      if (filter.id === "id") {
        query = {
          [`$productinstances.id$`]: { [Op.eq]: Number(filter.value) },
        };
        productInstanceFilter.push(query);
      } else if (filter.id === "orderId") {
        if (/^\d+$/.test(filter.value)) {
          query = {
            [`$order.id$`]: { [Op.eq]: Number(filter.value) },
          };
          orderFilter.push(query);
        } else {
          query = {
            [`$user.username$`]: { [Op.iLike]: `${filter.value}%` },
          };
          userFilter.push(query);
        }
      } else if (filter.id.includes("order.")) {
        const filterId = filter.id.split(".").pop();
        if (filterId === "createdAt") {
          query = {
            [filterId]: {
              [Op.gte]: `${filter.value}%`,
            },
          };
        } else {
          query =
            filterId !== "fundsDeposited"
              ? {
                  [`$${filter.id}$`]: {
                    [Op.iLike]: `${filter.value}%`,
                  },
                }
              : { [`$${filter.id}$`]: { [Op.eq]: filter.value } };
        }
        orderFilter.push(query);
      } else if (filter.id === "color" || filter.id === "size") {
        query = {
          [`$productinstances.${filter.id}$`]: {
            [Op.iLike]: `${filter.value}%`,
          },
        };
        productInstanceFilter.push(query);
      } else if (filter.id === "ordered") {
        // eslint-disable-next-line no-param-reassign
        filter.value = filter.value === "true";
        query = {
          [`$productinstances.${filter.id}$`]: {
            [Op.is]: filter.value,
          },
        };
        productInstanceFilter.push(query);
      } else if (filter.id.includes("product.")) {
        const filterId = filter.id.split(".").pop();
        query =
          filterId !== "price"
            ? {
                [filterId]: {
                  [Op.iLike]: `${filter.value}%`,
                },
              }
            : { [filterId]: { [Op.eq]: filter.value } };
        productFilter.push(query);
      } else if (filter.id.includes("tracking.")) {
        // split filter id by . and get the last element
        const filterId = filter.id.split(".").pop();
        if (filterId === "estimatedArrival" || filterId === "sentDate") {
          query = {
            [filterId]: {
              [Op.gte]: `${filter.value}%`,
            },
          };
        } else {
          query = {
            [filterId]: {
              [Op.iLike]: `${filter.value}%`,
            },
          };
        }
        trackingFilter.push(query);
      }
    });
  }
  const orderWhere =
    orderFilter.length > 0 ? { [Op.or]: [...orderFilter] } : {};
  const productInstanceWhere =
    productInstanceFilter.length > 0
      ? { [Op.or]: [...productInstanceFilter] }
      : {};
  const trackingWhere =
    trackingFilter.length > 0 ? { [Op.or]: [...trackingFilter] } : {};
  const productWhere =
    productFilter.length > 0 ? { [Op.or]: [...productFilter] } : {};
  const userWhere = userFilter.length > 0 ? { [Op.or]: [...userFilter] } : {};

  const trackingRequired = trackingFilter.length > 0;
  const productRequired = productFilter.length > 0;
  return {
    orderWhere,
    productInstanceWhere,
    trackingWhere,
    productWhere,
    trackingRequired,
    productRequired,
    userWhere,
  };
};

module.exports = getOrderColumnFilters;
