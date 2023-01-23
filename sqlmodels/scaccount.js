const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const Scaccount = sequelize.define(
    "scaccount",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "trackingcode is required" },
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING,
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
  return Scaccount;
};
