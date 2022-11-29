const { connect, connection } = require('mongoose');

const connectionString = process.env.DATABASE || 'mongodb://localhost:27017/socialNetworkDB';

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;
