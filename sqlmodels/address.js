const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "address",
    {
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "firstname is required" },
        },
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "lastname is required" },
        },
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "telephone is required" },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "city is required" },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "address is required" },
        },
      },
    },
    {
      freezeTableName: true,
      hooks: {
        beforeCreate: async (scaccount) => {
          const hashedPwd = await bcrypt.hash(scaccount.password, 10);
          // eslint-disable-next-line no-param-reassign
          scaccount.password = hashedPwd;
        },
      },
    },
  );
  return Address;
};
