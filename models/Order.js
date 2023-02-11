module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      fundsDeposited: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: "fundsDeposited is required" },
          notEmpty: { msg: "fundsDeposited is required" },
        },
      },
      deliveryPrice: { type: DataTypes.DECIMAL, defaultValue: 5 },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "status is required" },
          notEmpty: { msg: "status is required" },

          isIn: {
            args: [
              [
                "created",
                "ordered",
                "tracked",
                "sent",
                "delivered",
                "other",
                "canceled",
              ],
            ],
            msg: "invalid status",
          },
        },
      },
      customerNote: { type: DataTypes.TEXT },
      staffNote: { type: DataTypes.TEXT },
    },
    {
      freezeTableName: true,
    },
  );
  return Order;
};
