const asyncHandler = require("express-async-handler");
const {
  models: { Delivery },
} = require("../models");

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

  if (!firstname) {
    return res.status(400).json({ message: "firstname is required" });
  }
  if (!lastname) {
    return res.status(400).json({ message: "lastname is required" });
  }
  if (!telephone) {
    return res.status(400).json({ message: "telephone is required" });
  }
  if (!city) {
    return res.status(400).json({ message: "city is required" });
  }
  if (!address) {
    return res.status(400).json({ message: "address is required" });
  }

  const DeliveryObject = { firstname, lastname, telephone, city, address };

  // create new Delivery
  await Delivery.create(DeliveryObject);

  res.status(201).json();
});

const updateDelivery = asyncHandler(async (req, res) => {
  const { id, firstname, lastname, telephone, city, address } = req.body;

  const delivery = await Delivery.findByPk(id);

  if (!delivery) {
    return res.status(400).json({ message: "delivery not found" });
  }
  if (firstname) {
    delivery.firstname = firstname;
  }
  if (lastname) {
    delivery.lastname = lastname;
  }
  if (telephone) {
    delivery.telephone = telephone;
  }
  if (city) {
    delivery.city = city;
  }
  if (address) {
    delivery.address = address;
  }

  await delivery.save();

  res.status(200).json();
});

// @desc Delete a Delivery
// @routes Delete /deliveries
// @access Private
const deleteDelivery = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "delivery ID Required" });
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
