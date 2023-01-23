module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      productCode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "productcode is required" },
        },
      },

      thumbnail: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      taobaoPrice: DataTypes.DECIMAL,
      taobaoShippingPrice: DataTypes.DECIMAL,
      taobaoUrl: DataTypes.STRING,
      instagramUrl: DataTypes.STRING,
    },
    {
      freezeTableName: true,
    },
  );
  return Product;
};
