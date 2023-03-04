module.exports = (sequelize, DataTypes) => {
  const ScrapingStatus = sequelize.define("scraping", {
    status: {},
  });
  return ScrapingStatus;
};
