module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define(
    "delivery",
    {
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      telephone: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
    },
  );
  return Delivery;
};
