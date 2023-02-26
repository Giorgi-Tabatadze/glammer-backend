module.exports = (sequelize, DataTypes) => {
  const Tracking = sequelize.define("tracking", {
    trackingCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "trackingcode is required" },
        notEmpty: { msg: "trackingcode is required" },
      },
      unique: {
        arg: true,
        msg: "trackingcode is already taken.",
      },
    },
    flightNumber: DataTypes.STRING,
    status: DataTypes.STRING,
    declared: DataTypes.BOOLEAN,
    declaredFunds: DataTypes.DECIMAL,
    sentDate: DataTypes.DATEONLY,
    estimatedArrival: DataTypes.DATEONLY,
  });
  return Tracking;
};
