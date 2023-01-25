const bcrypt = require("bcrypt");

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
    },
    {
      freezeTableName: true,
      hooks: {
        beforeCreate: async (scaccount) => {
          if (scaccount.password) {
            const hashedPwd = await bcrypt.hash(scaccount.password, 10);
            // eslint-disable-next-line no-param-reassign
            scaccount.password = hashedPwd;
          }
        },
        beforeUpdate: async (scaccount) => {
          if (scaccount.password) {
            const hashedPwd = await bcrypt.hash(scaccount.password, 10);
            // eslint-disable-next-line no-param-reassign
            scaccount.password = hashedPwd;
          }
        },
      },
    },
  );
  return User;
};
