/* eslint-disable no-param-reassign */
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          arg: true,
          msg: "username is already taken.",
        },
        validate: {
          notNull: { msg: "username is required" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password is required" },
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "customer",
        isIn: [["customer", "employee", "admin"]],
      },
      publicId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
    },
    {
      freezeTableName: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const hashedPwd = await bcrypt.hash(user.password, 10);
            user.password = hashedPwd;
            user.username = user.username.toLowerCase();
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const hashedPwd = await bcrypt.hash(user.password, 10);
            // eslint-disable-next-line no-param-reassign
            user.password = hashedPwd;
            user.username = user.username.toLowerCase();
          }
        },
      },
    },
  );
  return User;
};
