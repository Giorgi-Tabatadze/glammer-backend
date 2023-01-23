const mongoose = require("mongoose");

const ProductInstance = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    tracking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tracking",
    },
    ordered: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    differentprice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProductInstance", ProductInstance);
