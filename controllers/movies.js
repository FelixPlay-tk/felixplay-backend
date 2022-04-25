const movieModel = require("../model/movieModel");

exports.addNewMovie = async (req, res) => {
    const {
        contentType,
        title,
        details,
        poster,
        banner,
        language,
        categories,
        cast,
        runtime,
        releaseDate,
        region,
        downloadLinks,
        streamLink,
    } = req.body;
    if (
        !(contentType,
        title,
        details,
        language,
        poster,
        banner,
        categories,
        cast,
        runtime,
        releaseDate,
        region,
        downloadLinks,
        streamLink)
    )
        return res.status(400).json("All fields are required!");

    try {
        const checkExist = await movieModel.findOne({
            title,
            language,
            releaseDate,
        });

        if (checkExist)
            return res.status(409).json({ message: "Movie already exists!" });
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};
