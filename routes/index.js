const { Router } = require("express");
const userRoute = require("../modules/user/route/user.route");
const authRoute = require("../modules/authen/route/auth.route");
const courtRoute = require("../modules/court/route/court.route");
const pricingRoute = require("../modules/pricings/route/pricing.route");
const bookingRoute = require("../modules/booking/route/booking.route");
const timeSlotRoute = require("../modules/timeslot/route/timeslot.route");

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/courts", courtRoute);
router.use("/pricings", pricingRoute);
router.use("/bookings", bookingRoute);
router.use("/time-slots", timeSlotRoute);

module.exports = router;