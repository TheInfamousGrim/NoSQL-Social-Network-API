// Import Router() from express
const router = require('express').Router();

// Import all of the API routes
const apiRoutes = require('./api');

// Add a prefix of '/api' to all of the api routes that are imported from the api folder
router.use('/api', apiRoutes);

// Any other route send a '📛 wrong route message! 📛'
router.use((req, res) => res.send('📛 wrong route message! 📛'));

module.exports = router;
