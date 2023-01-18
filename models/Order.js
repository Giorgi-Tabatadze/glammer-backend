const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    productinstances: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "ProductInstance",
      },
    ],
    fundsdeposited: {
      type: Number,
      required: true,
    },
    alternativeaddress: {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      telephone: {
        type: String,
      },
      city: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    customernote: {
      type: String,
    },
    staffnote: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

OrderSchema.plugin(AutoIncrement, {
  inc_field: "ordernumber",
  id: "ordernumbers",
  start_seq: 3000,
});

module.exports = mongoose.model("Order", OrderSchema);
