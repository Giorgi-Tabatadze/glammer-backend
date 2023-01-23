module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      fundsDeposited: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: "fundsDeposited is required" },
        },
      },
      deliveryPrice: { type: DataTypes.DECIMAL, defaultValue: 5 },
      status: {
        type: DataTypes.STRING,
        isIn: [
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
