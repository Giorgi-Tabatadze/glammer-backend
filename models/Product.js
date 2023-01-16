const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productcode: {
      type: String,
    },
    instagramurl: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    images: {
      type: [String],
    },
    price: {
      type: Number,
    },
    taobaoprice: {
      type: Number,
    },
    taobaoshippingprice: {
      type: Number,
    },
    taobaolink: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", ProductSchema);
