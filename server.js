const express = require("express");
const cors = require("cors");
require("./config/db");
require("dotenv/config");

const app = express();

// Import Routes
const authenticationRoute = require("./router/authenticationRoute");
const categoriesRoute = require("./router/categoriesRoute");
const moviesRoute = require("./router/moviesRoute");
const showsRoute = require("./router/showsRoute");
const browseFeaturedRoute = require("./router/browseFeaturedRoute");
const { search } = require("./controllers/browseFeatured");

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authenticationRoute);
app.use("/categories", categoriesRoute);
app.use("/browse", browseFeaturedRoute);
app.use("/movies", moviesRoute);
app.use("/shows", showsRoute);
app.use("/search", search);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server is running on port ", port);
});
