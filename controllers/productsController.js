const asyncHandler = require("express-async-handler");
const fs = require("fs");
const {
  models: { Product },
} = require("../models");

// @desc Get all Products
// @routes GET /products
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const products = await Product.findAll({
    limit,
    offset,
    where: {}, // conditions
  });
  if (!products?.length) {
    return res.status(400).json({ message: "no products found" });
  }
  res.json(products);
});

// @desc Create new Product
// @routes POST /products
// @access Private
const createNewProduct = asyncHandler(async (req, res, next) => {
  const {
    productCode,
    price,
    taobaoprice,
    taobaoshippingprice,
    taobaoUrl,
    instagramUrl,
  } = req.body;

  if (req?.fileUploadError) {
    return res.status(400).json({ message: req.fileUploadError.msg });
  }
  const productObject = {
    productCode,
    price,
    taobaoprice,
    taobaoshippingprice,
    taobaoUrl,
    instagramUrl,
    thumbnail: req?.file?.filename,
  };
  // create new Product
  await Product.create(productObject);
  res.status(201).json();
});

// @desc Update a Product
// @routes PATCH /products
// @access Private
const updateProduct = asyncHandler(async (req, res, next) => {
  const {
    id,
    productCode,
    price,
    taobaoprice,
    taobaoshippingprice,
    taobaoUrl,
    instagramUrl,
  } = req.body;

  if (req?.fileUploadError) {
    return res.status(400).json({ message: req.fileUploadError.msg });
  }

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const product = await Product.findByPk(id);

  if (!product) {
    return res.status(400).json({ message: "product not found" });
  }

  product.productCode = productCode;
  product.price = price;
  product.taobaoprice = taobaoprice;
  product.taobaoshippingprice = taobaoshippingprice;
  product.taobaoUrl = taobaoUrl;
  product.instagramUrl = instagramUrl;

  const oldThumbnail = product.thumbnail;

  if (req?.file?.filename) {
    product.thumbnail = req?.file?.filename;
  }
  await product.save();

  if (oldThumbnail && req?.file?.filename) {
    fs.unlink(oldThumbnail, (error) => {
      if (error) {
        console.log(error.stack);
      } else {
        console.log("oldthumbnail deleted due to update");
      }
    });
  }
  res.status(200).json();
});

// @desc Delete a Product
// @routes Delete /products
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "product id Required" });
  }

  const result = await Product.destroy({
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
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
