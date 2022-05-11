const Row = require("../classes/Row");
const movieModel = require("../model/movieModel");

const getMovie = (args) => {
    return movieModel
        .find(args || null, [
            "contentType",
            "title",
            "details",
            "poster",
            "releaseDate",
            "banner",
            "categories",
        ])
        .limit(20)
        .sort({ releaseDate: -1 });
};

// Get All Movies
exports.getAllMovieID = async (req, res) => {
    try {
        const response = await movieModel.find(null, ["contentType"]);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// add Movies
exports.addNewMovie = async (req, res) => {
    const {
        contentType,
        title,
        details,
        language,
        poster,
        banner,
        categories,
        runtime,
        releaseDate,
        region,
        streamLink,
        downloadLinks,
    } = req.body;

    if (
        !(contentType,
        title,
        details,
        language,
        poster,
        banner,
        categories,
        runtime,
        releaseDate,
        region,
        downloadLinks)
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
            runtime,
            releaseDate,
            region,
            streamLink,
            downloadLinks,
        });

        const saveMovie = await newMovie.save();
        res.status(201).json(saveMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
    const page = +req.query.page;
    const limit = 30;

    const result = {
        hasNext: false,
    };

    try {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const length = await movieModel
            .find({ categories: category })
            .countDocuments();

        if (endIndex < length) {
            result.hasNext = true;
        }

        const movies = await movieModel
            .find({ categories: category }, [
                "contentType",
                "banner",
                "title",
                "releaseDate",
            ])
            .sort({ releaseDate: -1 })
            .skip(startIndex)
            .limit(limit);

        result.items = movies;

        res.json(result);
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
            .select("-downloadLinks -streamLink -__v -updatedAt -createdAt");

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Download and stream links of a movie
exports.getMovieLinks = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await movieModel.findById(id, ["downloadLinks"]);

        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Featured Movies
exports.getFeatured = async (req, res) => {
    try {
        const result = await movieModel
            .find(null, [
                "contentType",
                "title",
                "language",
                "details",
                "banner",
                "releaseDate",
                "categories",
                "languages",
                "runtime",
            ])
            .sort({ releaseDate: -1 })
            .limit(5);

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all movie rows
exports.getMovieRows = async (req, res) => {
    const page = +req.query.page;
    const limit = 3;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {
        hasNext: false,
    };

    try {
        const allRows = await Promise.all([
            getMovie(),
            getMovie({ categories: "comedy" }),
            getMovie({ categories: "drama" }),
            getMovie({ categories: "mystery" }),
            getMovie({ categories: "family" }),
            getMovie({ categories: "crime" }),
            getMovie({ categories: "thriller" }),
            getMovie({ categories: "action" }),
            getMovie({ categories: "romance" }),
            getMovie({ categories: "horror" }),
        ]);

        const [
            latest,
            comedy,
            drama,
            mystery,
            family,
            crime,
            thriller,
            action,
            romance,
            horror,
        ] = allRows;

        const movies = [
            new Row(1, "latest", "movie", latest, false),
            new Row(2, "comedy", "movie", comedy, true),
            new Row(3, "drama", "movie", drama, true),
            new Row(3, "mystery", "movie", mystery, false),
            new Row(4, "family", "movie", family, true),
            new Row(5, "crime", "movie", crime, true),
            new Row(6, "thriller", "movie", thriller, true),
            new Row(7, "action", "movie", action, true),
            new Row(8, "romance", "movie", romance, true),
            new Row(9, "horror", "movie", horror, true),
        ];

        if (endIndex < movies.length) {
            result.hasNext = true;
        }

        result.data = movies.slice(startIndex, endIndex);

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
