const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const checkRole = require("../../../middleware/checkRole");
const verifyToken = require("../../../middleware/verify.token");

router.get("/", verifyToken, checkRole, userController.getAll);
router.get("/me", verifyToken, userController.getById);
router.get("/:id", verifyToken, userController.getById);
//Khong can truyen id
router.put("/me", verifyToken, userController.update);
//cho admin
router.put("/:id", verifyToken, checkRole, userController.update);
router.delete("/:id", verifyToken, checkRole, userController.delete);

module.exports = router;
