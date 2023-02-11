module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "product",
    {
      productCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          arg: true,
          msg: "productcode is already taken.",
        },
        validate: {
          notNull: { msg: "productcode is required" },
          notEmpty: { msg: "productcode is required" },
        },
      },

      thumbnail: {
        type: DataTypes.STRING,
        get() {
          const rawValue = this.getDataValue("thumbnail");
          return rawValue ? `images/products/${rawValue}` : null;
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: { msg: "price is required" },
          notEmpty: { msg: "price is required" },
        },
      },
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
