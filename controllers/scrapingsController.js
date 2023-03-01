const asyncHandler = require("express-async-handler");
const { format, parse } = require("date-fns");
const {
  models: { Tracking },
} = require("../models");

const updateTrackingsFromScrapedData = asyncHandler(async (req, res, next) => {
  const { trackings } = req.body;

  if (!trackings) {
    return res.status(400).json({ message: "trackings is required" });
  }

  res.status(200);
  res.json({ message: "Tracking update started" });

  const formatDate = (dateString) =>
    format(parse(dateString, "dd-MM-yyyy", new Date()), "yyyy-MM-dd");

  await Promise.all(
    trackings.map(async (tracking) => {
      const [trackingToUpdate, created] = await Tracking.findOrCreate({
        where: { trackingCode: tracking.trackingCode },
        defaults: {
          flightNumber: tracking.flightNumber,
          status: tracking.status,
          declared: tracking?.declared,
          declaredFunds: tracking?.declaredFunds,
          sentDate: tracking?.sentDate ? formatDate(tracking.sentDate) : null,
          estimatedArrival: tracking?.estimatedArrival
            ? formatDate(tracking.estimatedArrival)
            : null,
          arrivedDate: tracking?.arrivedDate
            ? formatDate(tracking.arrivedDate)
            : null,
          scaccountId: Number(tracking.scaccountId),
        },
      });
      if (!created) {
        // User already existed, so update their information
        if (tracking?.flightNumber) {
          trackingToUpdate.flightNumber = tracking.flightNumber;
        }
        if (tracking?.status) {
          trackingToUpdate.status = tracking.status;
        }
        if (tracking?.declared) {
          trackingToUpdate.declared = tracking.declared;
        }
        if (tracking?.declaredFunds) {
          trackingToUpdate.declaredFunds = tracking.declaredFunds;
        }
        if (tracking?.sentDate) {
          trackingToUpdate.sentDate = formatDate(tracking.sentDate);
        }
        if (tracking?.estimatedArrival) {
          trackingToUpdate.estimatedArrival = formatDate(
            tracking.estimatedArrival,
          );
        }
        if (tracking?.arrivedDate) {
          trackingToUpdate.arrivedDate = formatDate(tracking.arrivedDate);
        }
        if (tracking?.scaccountId) {
          trackingToUpdate.scaccountId = Number(tracking.scaccountId);
        }

        await trackingToUpdate.save();
      }
    }),
  );

  next();
});

module.exports = {
  updateTrackingsFromScrapedData,
};
