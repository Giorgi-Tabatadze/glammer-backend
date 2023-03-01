const asyncHandler = require("express-async-handler");
const fs = require("fs");
const sharp = require("sharp");
const {
  models: { Product },
} = require("../models");

const versions = [
  { width: 750, height: 750, suffix: "large" },
  { width: 300, height: 300, suffix: "medium" },
  { width: 150, height: 150, suffix: "small" },
];
// @desc Get all Products
// @routes GET /products
// @access Private
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 0, limit = 20, id } = req.query;
  const offset = page * limit;
  const sortingObject = ["id", "DESC"];
  const where = id ? { id: parseFloat(id) } : {};

  const products = await Product.findAll({
    limit,
    offset,
    where,
    order: [sortingObject], // conditions
  });

  res.json(products);
});

// @desc Create new Product
// @routes POST /products
// @access Private
const createNewProduct = asyncHandler(async (req, res, next) => {
  const { data } = req.body;

  const { price, taobaoPrice, shippingPrice, taobaoUrl, instagramUrl } =
    JSON.parse(data);

  if (req?.fileUploadError) {
    return res.status(400).json({ message: req.fileUploadError.msg });
  }
  if (!req.file) {
    return res.status(400).json({ message: "thumbnail is required" });
  }
  const productObject = {
    price,
    taobaoPrice,
    shippingPrice,
    taobaoUrl,
    instagramUrl,
  };
  const newProduct = await Product.create(productObject);

  const path = `./public/images/products/`;

  await Promise.all(
    versions.map(async (version) => {
      await sharp(req.file.buffer)
        .resize(version.width, version.height)
        .toFile(`${path}/${version.suffix}/${newProduct.id}.jpg`);
    }),
  );

  // Handle success case here

  // // create new Product
  res.status(201).json();
});

// @desc Update a Product
// @routes PATCH /products
// @access Private
const updateProduct = asyncHandler(async (req, res, next) => {
  const { data } = req.body;

  const { id, price, taobaoPrice, shippingPrice, taobaoUrl, instagramUrl } =
    JSON.parse(data);

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

  product.price = price;
  product.taobaoPrice = taobaoPrice;
  product.shippingPrice = shippingPrice;
  product.taobaoUrl = taobaoUrl;
  product.instagramUrl = instagramUrl;

  await product.save();

  if (req?.file?.buffer) {
    const path = `./public/images/products/`;

    await Promise.all(
      versions.map(async (version) => {
        await sharp(req.file.buffer)
          .resize(version.width, version.height)
          .toFile(`${path}/${version.suffix}/${product.id}.jpg`);
      }),
    );
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
    const path = `public/images/products`;

    await Promise.all(
      versions.map(async (version) => {
        fs.unlink(`${path}${version.suffix}/${id}.jpg`, (err) => {
          if (err && err.code === "ENOENT") {
            console.info("Error! File doesn't exist.");
          } else if (err) {
            console.error(err);
          } else {
            console.info(
              `Successfully removed file with the path of ${path}/${version.suffix}/${id}.jpg}`,
            );
          }
        });
      }),
    );

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
