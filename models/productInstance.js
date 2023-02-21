module.exports = (sequelize, DataTypes) => {
  const ProductInstance = sequelize.define("productinstance", {
    ordered: { type: DataTypes.BOOLEAN, defaultValue: false },
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    differentPrice: DataTypes.DECIMAL,
  });
  return ProductInstance;
};
