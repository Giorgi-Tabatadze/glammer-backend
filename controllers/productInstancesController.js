const asyncHandler = require("express-async-handler");
const ProductInstance = require("../models/ProductInstance");
const Product = require("../models/Product");
const Tracking = require("../models/Tracking");
const Order = require("../models/Order");

// @desc Get all ProductInstances
// @routes GET /productInstances
// @access Private
const getAllProductInstances = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const productInstances = await ProductInstance.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
  if (!productInstances?.length) {
    return res.status(400).json({ message: "No productInstances found" });
  }
  res.json(productInstances);
});

// @desc Create new ProductInstance
// @routes POST /productInstances
// @access Private
const createNewProductInstance = asyncHandler(async (req, res) => {
  const { product, tracking, size, color, differentprice } = req.body;

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
  productInstanceObject.size = size;
  productInstanceObject.color = color;
  productInstanceObject.differentprice = differentprice;

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
  const { id, product, tracking, ordered, size, color, differentprice } =
    req.body;

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
  productInstance.differentprice = differentprice;

  let updatedOrder = false;

  if (ordered) {
    const order = await Order.findOne({ productinstances: id })
      .populate("productinstances")
      .exec();
    if (!order) {
      return res
        .status(400)
        .json({ message: "ProductInstance is not assosiated with order" });
    }
    if (order.status === "created") {
      let allOrdered = true;
      order.productinstances.forEach((pI) => {
        if (!pI.ordered && pI._id.toString() !== id) {
          allOrdered = false;
        }
      });
      if (allOrdered) {
        order.status = "ordered";
        updatedOrder = await order.save();
      }
    }
  }
  try {
    await productInstance.save();
  } catch (error) {
    updatedOrder = await order.save();
  }

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

  const order = await Order.findOne({ productinstances: id }).lean().exec();
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
