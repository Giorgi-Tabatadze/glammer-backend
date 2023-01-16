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
      required: true,
      ref: "Tracking",
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProductInstance", ProductInstance);
