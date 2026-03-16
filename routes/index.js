const { Router } = require('express');
const userRoute = require('../modules/user/route/user.route');

const router = Router();

router.use('/users', userRoute);

module.exports = router;
