module.exports = (sequelize, DataTypes) => {
  const Tracking = sequelize.define(
    "tracking",
    {
      trackingcode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "trackingcode is required" },
        },
        unique: {
          arg: true,
          msg: "trackingcode is already taken.",
        },
      },
      status: DataTypes.STRING,
      declared: DataTypes.BOOLEAN,
      declaredFunds: DataTypes.DECIMAL,
      sentDate: DataTypes.DATEONLY,
      estimatedArrival: DataTypes.DATEONLY,
    },
    {
      freezeTableName: true,
    },
  );
  return Tracking;
};
