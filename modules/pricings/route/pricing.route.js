const express = require('express');
const router = express.Router();
const pricingController = require('../controller/pricing.controller');
const verifyToken = require('../../../middleware/verify.token');
const checkRole = require('../../../middleware/checkRole');

// user đã đăng nhập cũng xem được giá
router.use(verifyToken);

router.get('/', pricingController.getAll);
router.get('/:id', pricingController.getById);

// chỉ admin mới được tạo/sửa/xóa
router.post('/', checkRole, pricingController.create);
router.put('/:id', checkRole, pricingController.update);
router.delete('/:id', checkRole, pricingController.delete);

module.exports = router;