const express = require('express');
const dotenv = require('dotenv');
const {connectDB} = require('./lib/db.js');
dotenv.config();

const app = express();

const PORT = process.env.PORT;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log("The server is running on ", PORT);
    });
})
.catch((err) => {
    console.log("The database wasn't connected so the server has not started", err);
});