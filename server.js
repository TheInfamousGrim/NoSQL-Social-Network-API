const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/connection');
const routes = require('./routes');

// Set up environment variables
dotenv.config({ path: 'variables.env' });

// Set up the port
const PORT = process.env.PORT || 3001;
// Make sure the app is using express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});
