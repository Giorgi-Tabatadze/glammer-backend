module.exports = (sequelize, DataTypes) => {
  const Scaccount = sequelize.define(
    "scaccount",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "username is required" },
          notEmpty: { msg: "username is required" },
        },
        unique: {
          arg: true,
          msg: "email is already taken.",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "company is required" },
          notEmpty: { msg: "company is required" },
        },
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "company is required" },
          notEmpty: { msg: "company is required" },
        },
      },
    },
    {
      freezeTableName: true,
    },
  );
  return Scaccount;
};
