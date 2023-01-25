const asyncHandler = require("express-async-handler");
const {
  models: { Scaccount },
} = require("../sqlmodels");

// @desc Get all Scaccounts
// @routes GET /scaccounts
// @access Private

const getAllScaccounts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const Scaccounts = await Scaccount.findAll({
    limit,
    offset,
    where: {}, // conditions
  });
  if (!Scaccounts?.length) {
    return res.status(400).json({ message: "no Scaccounts found" });
  }
  return res.json(Scaccounts);
});

// @desc Create new Scaccount
// @routes POST /scaccounts
// @access Private
const createNewScaccount = asyncHandler(async (req, res) => {
  const { email, password, company } = req.body;

  const ScaccountObject = { email, password, company };

  // create new Scaccount
  await Scaccount.create(ScaccountObject);

  res.status(201).json();
});

const updateScaccount = asyncHandler(async (req, res) => {
  const { id, email, password, company } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  const scaccount = await Scaccount.findByPk(id);

  if (!scaccount) {
    return res.status(400).json({ message: "scaccount not found" });
  }
  scaccount.email = email;
  scaccount.password = password;
  scaccount.company = company;

  await scaccount.save();

  res.status(200).json();
});

// @desc Delete a Scaccount
// @routes Delete /scaccounts
// @access Private
const deleteScaccount = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Scaccount ID Required" });
  }
  const result = await Scaccount.destroy({
    where: {
      id,
    },
  });
  if (!result) {
    res.status(204);
  } else {
    res.status(200);
  }
  res.json();
});

module.exports = {
  getAllScaccounts,
  createNewScaccount,
  updateScaccount,
  deleteScaccount,
};
