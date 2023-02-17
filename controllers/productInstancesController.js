const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const {
  models: { ProductInstance, Tracking, Product },
} = require("../models");
const db = require("../models");

// @desc Get all ProductInstances
// @routes GET /productInstances
// @access Private
const getAllProductInstances = asyncHandler(async (req, res) => {
  const { page = 0, limit = 20, orderId } = req.query;
  const offset = page * limit;

  console.log(orderId);

  const where = parseFloat(orderId) ? { orderId: parseFloat(orderId) } : {};

  console.log(where);

  const productInstances = await ProductInstance.findAndCountAll({
    limit,
    offset,
    where,
    include: [
      {
        model: Tracking,
        required: false,
      },
      {
        model: Product,
        required: false,
      },
    ],
  });

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
    differentPrice,
    orderId,
    productId,
    trackingId,
  } = req.body;

  const productInstanceObject = {
    ordered: ordered === "true",
    size,
    color,
    differentPrice,
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
  const { id, ordered, size, color, differentPrice, productId, trackingCode } =
    req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  const productInstance = await ProductInstance.findByPk(id);
  if (!productInstance) {
    return res.status(400).json({ message: "productInstance not found" });
  }

  console.log(trackingCode);
  productInstance.ordered = ordered || ordered === "true";
  productInstance.size = size;
  productInstance.color = color;
  productInstance.differentPrice = differentPrice;
  productInstance.productId = productId;

  if (trackingCode) {
    const tracking = await Tracking.findOne({
      where: {
        trackingCode,
      },
    });
    if (tracking) {
      productInstance.trackingId = tracking.id;
      await productInstance.save();
    } else {
      await db.sequelize.transaction(async (t) => {
        const newTracking = await Tracking.create(
          {
            trackingCode,
          },
          { transaction: t },
        );
        productInstance.trackingId = newTracking.id;
        await productInstance.save({ transaction: t });
      });
    }
  } else {
    await productInstance.save();
  }

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
  const productInstance = await ProductInstance.findByPk(id);

  if (!productInstance) {
    return res.status(400).json({ message: "productInstance not found" });
  }

  const SameORderProductInstances = await ProductInstance.findAll({
    where: {
      orderId: productInstance.orderId,
    },
  });
  if (SameORderProductInstances.length === 1) {
    return res.status(400).json({
      message: "You can't delete the last productInstance of an order",
    });
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
