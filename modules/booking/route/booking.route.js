const express = require('express');
const router = express.Router();

const verifyToken = require('../../../middleware/verify.token');
const { bookingController } = require('../container');

router.use(verifyToken);

router.post('/',bookingController.createBooking);

module.exports = router;
