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

db.models.Delivery = require("./delivery")(sequelize, Sequelize.DataTypes);

db.models.Product = require("./product")(sequelize, Sequelize.DataTypes);
db.models.ProductInstance = require("./productInstance")(
  sequelize,
  Sequelize.DataTypes,
);

db.models.Tracking = require("./tracking")(sequelize, Sequelize.DataTypes);
db.models.Scaccount = require("./scaccount")(sequelize, Sequelize.DataTypes);

/// / ASSOSIATIONS //////////////////////////////

// USER has one DELIVERY
db.models.Delivery.hasOne(db.models.User, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
db.models.User.belongsTo(db.models.Delivery, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// Order has one ALTERNATIVE DELIVERY
db.models.Delivery.hasOne(db.models.Order, {
  foreignKey: "alternativeDeliveryId",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
db.models.Order.belongsTo(db.models.Delivery, {
  foreignKey: "alternativeDeliveryId",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// USER has many ORDERS
db.models.User.hasMany(db.models.Order, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
db.models.User.belongsTo(db.models.Delivery, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// ORDER has many PRODUCT INSTANCES
db.models.Order.hasMany(db.models.ProductInstance, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
db.models.ProductInstance.belongsTo(db.models.Order, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// PRODUCT has many PRODUCT INSTANCES
db.models.Product.hasMany(db.models.ProductInstance, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
db.models.ProductInstance.belongsTo(db.models.Product, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// TRACKING has many PRODUCT INSTANCES
db.models.Tracking.hasMany(db.models.ProductInstance, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
db.models.ProductInstance.belongsTo(db.models.Tracking, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// SCACCOUNT has many TRACKINGS

db.models.Scaccount.hasMany(db.models.Tracking, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
db.models.Tracking.belongsTo(db.models.Scaccount, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

module.exports = db;
