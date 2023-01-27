const asyncHandler = require("express-async-handler");
const {
  models: { ProductInstance },
} = require("../models");

// @desc Get all ProductInstances
// @routes GET /productInstances
// @access Private
const getAllProductInstances = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const productInstances = await ProductInstance.findAll({
    limit,
    offset,
    where: {}, // conditions
  });
  if (!productInstances?.length) {
    return res.status(400).json({ message: "no productInstances found" });
  }
  res.json(productInstances);
});

// @desc Create new ProductInstance
// @routes POST /productInstances
// @access Private
const createNewProductInstance = asyncHandler(async (req, res) => {
  const {
    ordered,
    size,
    color,
    differentprice,
    orderId,
    productId,
    trackingId,
  } = req.body;

  const productInstanceObject = {
    ordered,
    size,
    color,
    differentprice,
    orderId,
    productId,
    trackingId,
  };
  await ProductInstance.create(productInstanceObject);

  res.status(201);
  res.json();
});

// @desc Update a ProductInstance
// @routes PATCH /productInstances
// @access Private
const updateProductInstance = asyncHandler(async (req, res) => {
  const { id, ordered, size, color, differentprice, productId, trackingId } =
    req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  const productInstance = ProductInstance.findByPk(id);
  if (!productInstance) {
    return res.status(400).json({ message: "productInstance not found" });
  }

  productInstance.ordered = ordered;
  productInstance.size = size;
  productInstance.color = color;
  productInstance.differentprice = differentprice;
  productInstance.productId = productId;
  productInstance.trackingId = trackingId;

  await productInstance.save();

  res.json();
});

// @desc Delete a ProductInstance
// @routes Delete /productInstances
// @access Private
const deleteProductInstance = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  const result = await ProductInstance.destroy({
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
  getAllProductInstances,
  createNewProductInstance,
  updateProductInstance,
  deleteProductInstance,
};
