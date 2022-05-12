const mongoose = require("mongoose");

const showSchema = mongoose.Schema({
    contentType: { type: String, lowercase: true, default: "show" },
    title: { type: String, required: true, index: true, lowercase: true },
    details: { type: String, required: true, lowercase: true },
    language: [{ type: String, required: true }],
    poster: { type: String, required: true },
    banner: { type: String, required: true },
    platform: { type: String, index: true },
    categories: [{ type: String, index: true, lowercase: true }],
    releaseDate: { type: Date, required: true, index: true },
    region: { type: String, required: true, index: true, lowercase: true },
    episodes: [
        {
            episode: { type: Number, required: true },
            title: { type: String, required: true, lowercase: true },
            description: { type: String },
            runtime: { type: String },
            streamLink: { type: String, default: "" },
            downloadLinks: [
                {
                    link: { type: String, required: true },
                    resolution: { type: String, required: true },
                    size: { type: String, required: true },
                },
            ],
        },
    ],
});

module.exports = mongoose.model("show", showSchema);
