module.exports = {
  HOST: process.env.HOST,
  PORT: process.env.DBPORT || 5432,
  USER: process.env.DBUSER,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  DIALECT: process.env.DIALECT,
};
