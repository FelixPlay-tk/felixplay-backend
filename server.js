const express = require("express");
const cors = require("cors");
require("./config/db");
require("dotenv/config");
const app = express();

// Import Routes
const authenticationRoute = require("./router/authenticationRoute");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authenticationRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is running on port ", port);
});
