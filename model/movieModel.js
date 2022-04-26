const mongoose = require("mongoose");

const movieSchema = mongoose.Schema({
    contentType: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
    },
    title: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
    },
    details: {
        type: String,
        required: true,
        lowercase: true,
    },
    language: {
        type: String,
        required: true,
        index: true,
    },
    poster: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    categories: [
        {
            type: String,
            index: true,
            lowercase: true,
        },
    ],

    cast: [
        {
            type: String,
            required: true,
            index: true,
            lowercase: true,
        },
    ],

    runtime: {
        type: String,
        required: true,
    },

    releaseDate: {
        type: Date,
        required: true,
        index: true,
    },
    region: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
    },

    downloadLinks: [
        {
            resolution: { type: String },
            link: { type: String, required: true },
            size: { type: String, required: true },
        },
    ],

    streamLink: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("movie", movieSchema);
