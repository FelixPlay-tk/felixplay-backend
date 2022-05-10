const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
    {
        contentType: { type: String, lowercase: true, default: "movie" },
        title: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        details: { type: String, required: true, lowercase: true },
        language: [{ type: String, required: true, lowercase: true }],
        poster: { type: String, required: true },
        banner: { type: String, required: true },
        categories: [{ type: String, index: true, lowercase: true }],
        runtime: { type: String, required: true },
        releaseDate: { type: Date, required: true, index: true },
        region: { type: String, required: true, index: true, lowercase: true },
        streamLink: { type: String },
        downloadLinks: [
            {
                link: { type: String, required: true },
                size: { type: String, required: true },
                resolution: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("movie", movieSchema);
