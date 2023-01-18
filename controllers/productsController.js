const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const ProductInstance = require("../models/ProductInstance");

// @desc Get all Products
// @routes GET /products
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().lean();
  if (!products?.length) {
    return res.status(400).json({ message: "No products found" });
  }
  res.json(products);
});

// @desc Create new Product
// @routes POST /products
// @access Private
const createNewProduct = asyncHandler(async (req, res) => {
  const {
    productcode,
    instagramurl,
    thumbnail,
    images,
    price,
    taobaoprice,
    taobaoshippingprice,
    taobaolink,
  } = req.body;

  if (!productcode) {
    return res.status(400).json({ message: "Product Code Required" });
  }

  const duplicate = await Product.findOne({ productcode })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Product Code" });
  }

  const productObject = {};

  productObject.productcode = productcode;

  if (instagramurl) {
    productObject.instagramurl = instagramurl;
  }
  if (thumbnail) {
    productObject.thumbnail = thumbnail;
  }
  if (images) {
    if (!Array.isArray(images))
      return res.status(400).json({ message: "Images data must be an array" });
    productObject.images = images;
  }
  if (price) {
    productObject.price = price;
  }
  if (taobaoprice) {
    productObject.taobaoprice = taobaoprice;
  }
  if (taobaoshippingprice) {
    productObject.taobaoshippingprice = taobaoshippingprice;
  }
  if (taobaolink) {
    productObject.taobaolink = taobaolink;
  }

  // create and store new Product

  const product = await Product.create(productObject);

  if (product) {
    // Created
    res.status(201).json({ message: `New Product created` });
  } else {
    res.status(400).json({ message: "Invalid Product data received" });
  }
});

// @desc Update a Product
// @routes PATCH /products
// @access Private
const updateProduct = asyncHandler(async (req, res) => {
  const {
    id,
    productcode,
    instagramurl,
    thumbnail,
    images,
    price,
    taobaoprice,
    taobaoshippingprice,
    taobaolink,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  if (productcode) {
    const duplicate = await Product.findOne({ productcode })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate Product Code" });
    }
    product.productcode = productcode;
  }
  product.instagramurl = instagramurl;
  product.thumbnail = thumbnail;
  product.images = images;
  product.price = price;
  product.taobaoprice = taobaoprice;
  product.taobaoshippingprice = taobaoshippingprice;
  product.taobaolink = taobaolink;

  await product.save();

  res.json({ message: `Product Updated` });
});

// @desc Delete a Product
// @routes Delete /products
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product ID Required" });
  }

  const productInstance = await ProductInstance.findOne({ product: id })
    .lean()
    .exec();
  if (productInstance) {
    return res.status(400).json({ message: "Product has ProductInstances" });
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  const result = await product.deleteOne();

  const reply = `Product with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
