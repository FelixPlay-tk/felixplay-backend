const express = require("express");
const cors = require("cors");
require("./config/db");
require("dotenv/config");
const app = express();

// Import Routes
const authenticationRoute = require("./router/authenticationRoute");
const categoriesRoute = require("./router/categoriesRoute");
const moviesRoute = require("./router/moviesRoute");
const { default: axios } = require("axios");

// Middlewares
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
app.use(express.json());

// Routes
app.use("/auth", authenticationRoute);
app.use("/categories", categoriesRoute);
app.use("/movies", moviesRoute);

app.get("/", async (req, res) => {
    res.send("");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is running on port ", port);
});
