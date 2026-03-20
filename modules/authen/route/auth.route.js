const express = require('express');
const router = express.Router();
const { authController } = require('../container');

router.post('/register', authController.register.bind(authController));

module.exports = router;
