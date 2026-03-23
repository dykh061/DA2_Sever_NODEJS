const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

const verifyToken = require('../../../middleware/verify.token');

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
//Khong can truyen id
router.put('/me', verifyToken, userController.update);
//cho admin
router.put('/:id', verifyToken, userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
