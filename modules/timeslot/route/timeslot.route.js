const express = require('express');
const router = express.Router();
const timeSlotController = require('../controller/timeslot.controller');
const verifyToken = require('../../../middleware/verify.token');
const checkRole = require('../../../middleware/checkRole');

router.use(verifyToken);
router.get('/', timeSlotController.getAll);
router.get('/:id', timeSlotController.getById);

router.use(verifyToken, checkRole);

router.post('/', timeSlotController.create);
router.put('/:id', timeSlotController.update);
router.delete('/:id', timeSlotController.delete);

module.exports = router;