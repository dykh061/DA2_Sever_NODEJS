const { Router } = require('express');
const userRoute = require('../modules/user/route/user.route');
const authRoute = require('../modules/authen/route/auth.route');

const router = Router();

router.use('/users', userRoute);
router.use('/auth', authRoute);

module.exports = router;
