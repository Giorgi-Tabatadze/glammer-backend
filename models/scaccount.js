const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Scaccount = sequelize.define(
    "scaccount",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "email is required" },
          isEmail: true,
        },
        unique: {
          arg: true,
          msg: "email is already taken.",
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "company is required" },
        },
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
  return Scaccount;
};
