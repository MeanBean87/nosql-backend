const router = require('express').Router();
const usersRoutes = require('./users');
const thoughtsRoutes = require('./thoughts');

router.use('/users', usersRoutes);
router.use('/thoughts', thoughtsRoutes);

module.exports = router;