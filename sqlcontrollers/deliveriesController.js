const asyncHandler = require("express-async-handler");
const {
  models: { Delivery },
} = require("../sqlmodels");

// @desc Get all Deliveris
// @routes GET /deliveries
// @access Private

const getAllDeliveries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const Deliveries = await Delivery.findAll({
    limit,
    offset,
    where: {}, // conditions
  });
  if (!Deliveries?.length) {
    return res.status(400).json({ message: "no deliveries found" });
  }
  return res.json(Deliveries);
});

// @desc Create new Delivery
// @routes POST /deliveries
// @access Private
const createNewDelivery = asyncHandler(async (req, res) => {
  const { firstname, lastname, telephone, city, address } = req.body;

  const DeliveryObject = { firstname, lastname, telephone, city, address };

  // create new Delivery
  await Delivery.create(DeliveryObject);

  res.status(201).json();
});

const updateDelivery = asyncHandler(async (req, res) => {
  const { id, firstname, lastname, telephone, city, address } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }
  const delivery = await Delivery.findByPk(id);

  if (!delivery) {
    return res.status(400).json({ message: "delivery not found" });
  }
  delivery.firstname = firstname;
  delivery.lastname = lastname;
  delivery.telephone = telephone;
  delivery.city = city;
  delivery.address = address;

  await delivery.save();

  res.status(200).json();
});

// @desc Delete a Delivery
// @routes Delete /deliveries
// @access Private
const deleteDelivery = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Delivery ID Required" });
  }
  const result = await Delivery.destroy({
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
  getAllDeliveries,
  createNewDelivery,
  updateDelivery,
  deleteDelivery,
};
