const { connect, connection } = require('mongoose');

// Import our environment variables
require('dotenv').config({ path: 'variables.env' });

const connectionString = process.env.DATABASE || 'mongodb://localhost:27017/social-networkdb';

connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => console.log('MONGO CONNECTION OPEN!!!'))
    .catch((err) => console.log(err));

module.exports = connection;
