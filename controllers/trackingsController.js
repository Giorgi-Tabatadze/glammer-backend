const asyncHandler = require("express-async-handler");
const {
  models: { Tracking },
} = require("../models");

// @desc Get all Trackings
// @routes GET /trackings
// @access Private
const getAllTrackings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const trackings = await Tracking.findAll({
    limit,
    offset,
    where: {}, // conditions
  });
  if (!trackings?.length) {
    return res.status(400).json({ message: "no trackings found" });
  }
  res.json(trackings);
});

// @desc Create new Tracking
// @routes POST /trackings
// @access Private
const createNewTracking = asyncHandler(async (req, res) => {
  const {
    scaccountId,
    trackingCode,
    status,
    declared,
    declaredFunds,
    sentDate,
    estimatedArrival,
  } = req.body;

  if (!trackingCode) {
    return res.status(400).json({ message: "trackingCode required" });
  }
  if (!scaccountId && !(scaccountId === 0)) {
    return res.status(400).json({ message: "scaccountId required" });
  }

  const trackingObject = {};

  trackingObject.scaccountId = scaccountId;
  trackingObject.trackingCode = trackingCode;
  trackingObject.status = status;
  trackingObject.declared = declared;
  trackingObject.declaredFunds = declaredFunds;
  trackingObject.sentDate = sentDate;
  trackingObject.estimatedArrival = estimatedArrival;

  // create new Tracking
  await Tracking.create(trackingObject);

  res.status(201).json();
});

// @desc Update a Tracking
// @routes PATCH /trackings
// @access Private
const updateTracking = asyncHandler(async (req, res) => {
  const {
    id,
    scaccountId,
    trackingCode,
    status,
    declared,
    declaredFunds,
    sentDate,
    estimatedArrival,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const tracking = await Tracking.findByPk(id);

  if (!tracking) {
    return res.status(400).json({ message: "tracking not found" });
  }

  tracking.scaccountId = scaccountId;
  tracking.trackingCode = trackingCode;
  tracking.status = status;
  tracking.declared = declared;
  tracking.declaredFunds = declaredFunds;
  tracking.sentDate = sentDate;
  tracking.estimatedArrival = estimatedArrival;

  await tracking.save();

  res.json();
});

// @desc Delete a Tracking
// @routes Delete /trackings
// @access Private
const deleteTracking = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "tracking id Required" });
  }

  const result = await Tracking.destroy({
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
  getAllTrackings,
  createNewTracking,
  updateTracking,
  deleteTracking,
};
