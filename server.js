const express = require("express");
const cors = require("cors");
require("./config/db");
require("dotenv/config");

// init app
const app = express();

// Import Routes
const authenticationRoute = require("./router/authenticationRoute");

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Api is running");
});

// routes
app.use("/auth", authenticationRoute);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is running on port ", port);
});
