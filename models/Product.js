module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: { msg: "price is required" },
        notEmpty: { msg: "price is required" },
      },
    },
    taobaoPrice: DataTypes.DECIMAL,
    shippingPrice: DataTypes.DECIMAL,
    taobaoUrl: DataTypes.STRING,
    instagramUrl: DataTypes.STRING,
  });
  return Product;
};
