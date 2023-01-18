const asyncHandler = require("express-async-handler");
const ProductInstance = require("../models/ProductInstance");
const Product = require("../models/Product");
const Tracking = require("../models/Tracking");
const Order = require("../models/Order");

// @desc Get all ProductInstances
// @routes GET /productInstances
// @access Private
const getAllProductInstances = asyncHandler(async (req, res) => {
  const productInstances = await ProductInstance.find().lean();
  if (!productInstances?.length) {
    return res.status(400).json({ message: "No productInstances found" });
  }
  res.json(productInstances);
});

// @desc Create new ProductInstance
// @routes POST /productInstances
// @access Private
const createNewProductInstance = asyncHandler(async (req, res) => {
  const { product, tracking, size, color } = req.body;

  if (!product) {
    return res.status(400).json({
      message: "Product is required to create ProductInstance",
    });
  }
  const foundProduct = await Product.findById(product).lean();

  if (!foundProduct) {
    return res.status(400).json({
      message: "Invalid Product ID",
    });
  }

  const productInstanceObject = {};

  productInstanceObject.product = product;

  if (tracking) {
    const trackingFound = await Tracking.findById(tracking).lean();
    if (!trackingFound) {
      return res.status(400).json({
        message: "Invalid Tracking ID",
      });
    }
    productInstanceObject.tracking = tracking;
  }
  if (size) {
    productInstanceObject.size = size;
  }
  if (color) {
    productInstanceObject.color = color;
  }

  // create and store new ProductInstance

  const productInstance = await ProductInstance.create(productInstanceObject);

  if (productInstance) {
    // Created
    res.status(201).json({ message: `New ProductInstance created` });
  } else {
    res.status(400).json({ message: "Invalid ProductInstance data received" });
  }
});

// @desc Update a ProductInstance
// @routes PATCH /productInstances
// @access Private
const updateProductInstance = asyncHandler(async (req, res) => {
  const { id, product, tracking, size, color } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const productInstance = await ProductInstance.findById(id).exec();

  if (!productInstance) {
    return res.status(400).json({ message: "ProductInstance not found" });
  }

  if (product) {
    const foundProduct = await Product.findById(product).lean();

    if (!foundProduct) {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }
    productInstance.product = product;
  }
  if (tracking) {
    const trackingFound = await Tracking.findById(tracking).lean();
    if (!trackingFound) {
      return res.status(400).json({
        message: "Invalid Tracking ID",
      });
    }
  }
  productInstance.tracking = tracking;
  productInstance.size = size;
  productInstance.color = color;

  await productInstance.save();

  res.json({ message: `ProductInstance Updated` });
});

// @desc Delete a ProductInstance
// @routes Delete /productInstances
// @access Private
const deleteProductInstance = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ProductInstance ID Required" });
  }

  const order = await Order.findOne({ productintances: id }).lean().exec();
  if (order?.length) {
    return res.status(400).json({ message: "ProductInstance has orders" });
  }

  const productInstance = await ProductInstance.findById(id).exec();

  if (!productInstance) {
    return res.status(400).json({ message: "ProductInstance not found" });
  }

  const result = await productInstance.deleteOne();

  const reply = `ProductInstance with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllProductInstances,
  createNewProductInstance,
  updateProductInstance,
  deleteProductInstance,
};
