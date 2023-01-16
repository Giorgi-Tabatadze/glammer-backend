const mongoose = require("mongoose");

const TrackingSchema = new mongoose.Schema(
  {
    scaccount: {
      type: String,
    },
    trackingnumber: {
      type: String,
    },
    status: {
      type: String,
    },
    declared: {
      type: Boolean,
    },
    decraledfunds: {
      type: Number,
    },
    sentdate: {
      type: Date,
    },
    estimatedarrival: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Tracking", TrackingSchema);
