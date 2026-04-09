const express = require("express");
const router = express.Router();
const { authController } = require("../container");
const asyncHandler = require("../../../middleware/asyncHandler.middleware");
const verifyToken = require("../../../middleware/verify.token");

//
//
// có cái middleware asyncHandler để bộc bên ngoài dùng để bắt lỗi từ các controller trả về promise
// mà không cần phải dùng try/catch ở mỗi controller, giúp code gọn hơn và dễ bảo trì hơn
//
//
// endpoint dang nhap
router.post("/login", asyncHandler(authController.login.bind(authController)));
// endpoint dang ky
router.post(
  "/register",
  asyncHandler(authController.register.bind(authController)),
);
router.post(
  "/logout",
  asyncHandler(verifyToken),
  asyncHandler(authController.logout.bind(authController)),
);
router.post(
  "/refresh",
  asyncHandler(authController.refreshToken.bind(authController)),
);

module.exports = router;