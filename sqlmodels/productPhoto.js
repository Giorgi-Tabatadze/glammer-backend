module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    "productimage",
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Image url is required" },
        },
      },
      isThumbnail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
    },
  );
  return ProductImage;
};
