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

// Get Download and stream links of a movie
exports.getMovieLinks = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await movieModel.findById(id, [
            "streamLink",
            "downloadLinks",
        ]);
        // .select("-__v");
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all movie rows
exports.getMovieRows = async (req, res) => {
    try {
        const [
            featured,
            latest,
            comedy,
            drama,
            family,
            crime,
            thriller,
            action,
            romance,
            horror,
            bengali,
            hindi,
            english,
        ] = await Promise.all([
            // featured
            await movieModel
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
                .limit(5),

            // latest
            movieModel
                .find(null, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .sort({ releaseDate: -1 })
                .limit(20),

            //comedy movies
            movieModel
                .find({ categories: "comedy" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //drama movies
            movieModel
                .find({ categories: "drama" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //family movies
            movieModel
                .find({ categories: "family" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //crime movies
            movieModel
                .find({ categories: "crime" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //thriller movies
            movieModel
                .find({ categories: "thriller" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //action movies
            movieModel
                .find({ categories: "action" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //romance movies
            movieModel
                .find({ categories: "romance" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //horror movies
            movieModel
                .find({ categories: "horror" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //Bengali movies
            movieModel
                .find({ language: "bengali" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //hindi movies
            movieModel
                .find({ language: "hindi" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),

            //english movies
            movieModel
                .find({ language: "english" }, [
                    "contentType",
                    "title",
                    "detail",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),
        ]);

        const movies = [
            { title: "latest", hasMore: false, movies: latest, id: "row1" },
            { title: "comedy", hasMore: true, movies: comedy, id: "row2" },
            { title: "drama", hasMore: true, movies: drama, id: "row3" },
            { title: "family", hasMore: true, movies: family, id: "row4" },
            { title: "crime", hasMore: true, movies: crime, id: "row5" },
            { title: "thriller", hasMore: true, movies: thriller, id: "row6" },
            { title: "action", hasMore: true, movies: action, id: "row7" },
            { title: "romance", hasMore: true, movies: romance, id: "row8" },
            { title: "horror", hasMore: true, movies: horror, id: "row9" },
            { title: "bengali", hasMore: true, movies: bengali, id: "row10" },
            { title: "hindi", hasMore: true, movies: hindi, id: "row11" },
            { title: "english", hasMore: true, movies: english, id: "row12" },
        ];

        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Movies
exports.getAllMovies = async (req, res) => {
    try {
        const response = await movieModel.find(null, ["contentType"]);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};
