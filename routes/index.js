const { Router } = require("express");
const userRoute = require("../modules/user/route/user.route");
const authRoute = require("../modules/authen/route/auth.route");
const courtRoute = require("../modules/court/route/court.route");

const router = Router();

router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/courts", courtRoute);

module.exports = router;