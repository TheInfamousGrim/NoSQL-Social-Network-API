// Import router from express
const router = require('express').Router();
// Import all user routes from the userRoutes file
const userRoutes = require('./userRoutes');
// Import all thought routes from the thoughtRoutes file
const thoughtRoutes = require('./thoughtRoutes');

// Prefix all thought routes with '/thoughts'
router.use('/thoughts', thoughtRoutes);
// Prefix all user routes with '/users'
router.use('/users', userRoutes);

module.exports = router;
