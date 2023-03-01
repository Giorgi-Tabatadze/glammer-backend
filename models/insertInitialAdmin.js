const {
  models: { User },
} = require(".");

const InsertInitialAdmin = async () => {
  const [adminUser, created] = await User.findOrCreate({
    where: { username: "iakoAdmin" },
    defaults: { password: "123456", role: "admin" },
  });
};

module.exports = InsertInitialAdmin;
