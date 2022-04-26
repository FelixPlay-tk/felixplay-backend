const movieModel = require("../model/movieModel");

// add Movies
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
        region)
    )
        return res.status(400).json({ message: "All fields are required!" });

    try {
        const checkExist = await movieModel.findOne({
            title,
            language,
            releaseDate,
        });

        if (checkExist)
            return res.status(409).json({ message: "Movie already exists!" });

        const newMovie = new movieModel({
            contentType,
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
            streamLink,
        });

        const saveMovie = await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Featured Movies
exports.getFeaturedMovies = async (req, res) => {
    try {
        const response = await movieModel
            .find(null, [
                "contentType",
                "title",
                "detail",
                "banner",
                "releaseDate",
                "categories",
                "languages",
            ])
            .sort({ releaseDate: -1 })
            .limit(5);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// Get Movies By Language
exports.getMoviesByLanguage = async (req, res) => {
    const { language } = req.params;

    try {
        const results = await movieModel
            .find({ language: language }, ["contentType", "banner", "title"])
            .sort({ releaseDate: -1 });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// Get Movies by Category
exports.getMoviesByCategory = async (req, res) => {
    const { category } = req.params;
    const { limit } = req.query;

    try {
        const results = await movieModel
            .find({ categories: category }, ["contentType", "banner", "title"])
            .sort({ releaseDate: -1 })
            .limit(limit);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// Get Single Movie
exports.getSingleMovie = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await movieModel
            .findById(id)
            .select("-downloadLinks")
            .select("-streamLink")
            .select("-__v");

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
