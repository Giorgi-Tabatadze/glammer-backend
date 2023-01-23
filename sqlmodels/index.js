const Sequelize = require("sequelize");
const dbConfig = require("../config/sqlDbConn");

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
  },
);
const db = {};
db.sequelize = sequelize;
db.models = {};

db.models.User = require("./user")(sequelize, Sequelize.DataTypes);

db.models.Order = require("./order")(sequelize, Sequelize.DataTypes);

db.models.Address = require("./address")(sequelize, Sequelize.DataTypes);

db.models.Product = require("./product")(sequelize, Sequelize.DataTypes);
db.models.ProductInstance = require("./productInstance")(
  sequelize,
  Sequelize.DataTypes,
);
db.models.Productphoto = require("./productPhoto")(
  sequelize,
  Sequelize.DataTypes,
);

/// / ASSOSIATIONS //////////////////////////////

// USER has one ADDRESS
db.models.Address.hasOne(db.models.User);
db.models.User.belongsTo(db.models.Address);

// Order has one ALTERNATIVE ADDRESS
db.models.Address.hasOne(db.models.Order, {
  foreignKey: "alternativeAddressId",
});
db.models.Order.belongsTo(db.models.Address);

// USER has many ORDERS
db.models.User.hasMany(db.models.Order, {
  foreignKey: {
    allowNull: false,
  },
});
db.models.User.belongsTo(db.models.Address);

// ORDER has many PRODUCT INSTANCES
db.models.Order.hasMany(db.models.ProductInstance, {
  foreignKey: {
    allowNull: false,
  },
});
db.models.ProductInstance.belongsTo(db.models.Order);

// PRODUCT has many PHOTOS
db.models.Product.hasMany(db.models.Productphoto);
db.models.Productphoto.belongsTo(db.models.Product);

// PRODUCT has many PRODUCT INSTANCES
db.models.Product.hasMany(db.models.ProductInstance, {
  foreignKey: {
    allowNull: false,
  },
});
db.models.ProductInstance.belongsTo(db.models.Product);

// TRACKING has many PRODUCT INSTANCES
db.models.Tracking.hasMany(db.models.ProductInstance);
db.models.ProductInstance.belongsTo(db.models.Tracking);

// SCACCOUNT has many TRACKINGS
db.models.Tracking = require("./tracking")(sequelize, Sequelize.DataTypes);
db.models.Scaccount = require("./scaccount")(sequelize, Sequelize.DataTypes);

db.models.Scaccount.hasMany(db.models.Tracking);
db.models.Tracking.belongsTo(db.models.Scaccount);

module.exports = db;
