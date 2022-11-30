const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/connection');
const routes = require('./routes');

// Set up environment variables
dotenv.config({ path: 'variables.env' });


const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});
