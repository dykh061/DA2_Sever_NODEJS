const express = require('express');
const router = express.Router();

const checkRole = require('../../../middleware/checkRole');
const verifyToken = require('../../../middleware/verify.token');
const { bookingController } = require('../container');

router.use(verifyToken);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getBookingByUserId);
router.get('/availability', bookingController.getAvailableSlots);
router.get('/statistics', checkRole, bookingController.getStatistics);
router.get('/', checkRole, bookingController.getAllBooking);
router.patch('/:id/complete', checkRole, bookingController.completeBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);
router.get('/:id', bookingController.getBookingDetail);

module.exports = router;
