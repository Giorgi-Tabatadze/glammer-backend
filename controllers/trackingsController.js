const asyncHandler = require("express-async-handler");
const Tracking = require("../models/Tracking");
const ProductInstance = require("../models/Product");

// @desc Get all Trackings
// @routes GET /trackings
// @access Private
const getAllTrackings = asyncHandler(async (req, res) => {
  const trackings = await Tracking.find().lean();
  if (!trackings?.length) {
    return res.status(400).json({ message: "No trackings found" });
  }
  res.json(trackings);
});

// @desc Create new Tracking
// @routes POST /trackings
// @access Private
const createNewTracking = asyncHandler(async (req, res) => {
  const {
    scaccount,
    trackingcode,
    status,
    declared,
    declaredfunds,
    sentdate,
    estimatedarrival,
  } = req.body;

  if (!trackingcode || !scaccount) {
    return res
      .status(400)
      .json({ message: "Tracking Code and SC account required Required" });
  }

  const duplicate = await Tracking.findOne({ trackingcode })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Tracking Code" });
  }

  const trackingObject = {};

  trackingObject.scaccount = scaccount;
  trackingObject.trackingcode = trackingcode;

  if (status) {
    trackingObject.status = status;
  }
  if (declared) {
    trackingObject.declared = declared;
  }
  if (declaredfunds) {
    trackingObject.declaredfunds = Number(declaredfunds);
  }
  if (sentdate) {
    trackingObject.sentdate = sentdate;
  }
  if (estimatedarrival) {
    trackingObject.estimatedarrival = estimatedarrival;
  }

  // create and store new Tracking

  const tracking = await Tracking.create(trackingObject);

  if (tracking) {
    // Created
    res.status(201).json({ message: `New Tracking created` });
  } else {
    res.status(400).json({ message: "Invalid Tracking data received" });
  }
});

// @desc Update a Tracking
// @routes PATCH /trackings
// @access Private
const updateTracking = asyncHandler(async (req, res) => {
  const {
    id,
    scaccount,
    trackingcode,
    status,
    declared,
    declaredfunds,
    sentdate,
    estimatedarrival,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const tracking = await Tracking.findById(id).exec();

  if (!tracking) {
    return res.status(400).json({ message: "Tracking not found" });
  }

  if (trackingcode) {
    const duplicate = await Tracking.findOne({ trackingcode })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate Tracking Code" });
    }
    tracking.trackingcode = trackingcode;
  }
  if (scaccount) {
    tracking.scaccount = scaccount;
  }
  tracking.status = status;
  tracking.declared = declared;
  tracking.declaredfunds = declaredfunds;
  tracking.sentdate = sentdate;
  tracking.estimatedarrival = estimatedarrival;

  await tracking.save();

  res.json({ message: `Tracking Updated` });
});

// @desc Delete a Tracking
// @routes Delete /trackings
// @access Private
const deleteTracking = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Tracking ID Required" });
  }

  const productInstance = await ProductInstance.findOne({ tracking: id })
    .lean()
    .exec();
  if (productInstance?.length) {
    return res.status(400).json({ message: "Tracking has ProductInstance" });
  }

  const tracking = await Tracking.findById(id).exec();

  if (!tracking) {
    return res.status(400).json({ message: "Tracking not found" });
  }

  const result = await tracking.deleteOne();

  const reply = `Tracking with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllTrackings,
  createNewTracking,
  updateTracking,
  deleteTracking,
};
