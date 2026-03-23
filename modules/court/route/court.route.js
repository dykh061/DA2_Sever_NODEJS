const express = require('express');
const router = express.Router();
const courtController = require('../controller/court.controller');

// const verifyToken = require('../../../middleware/verify.token');
// const checkRole = require('../../../middleware/checkRole');
// router.use(verifyToken, checkRole);

router.get('/', courtController.getAll);
router.get('/:id', courtController.getById);
router.post('/', courtController.create);
router.put('/:id', courtController.update);
router.delete('/:id', courtController.delete);

module.exports = router;