const mongoose = require("mongoose");

const TrackingSchema = new mongoose.Schema(
  {
    scaccount: {
      type: String,
      required: true,
    },
    trackingcode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    declared: {
      type: Boolean,
    },
    declaredfunds: {
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
