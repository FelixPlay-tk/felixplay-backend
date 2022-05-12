const mongoose = require("mongoose");
require("dotenv").config();

// connecting to db
const db = mongoose
    .connect(process.env.DB_URL)
    .then((res) => {
        console.log(`MongoDB connected ${res.connection.host}`);
    })
    .catch((err) => console.log(err.message));

module.exports = db;
