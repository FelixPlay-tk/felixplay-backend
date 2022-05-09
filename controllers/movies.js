const movieModel = require("../model/movieModel");

// add Movies
exports.addNewMovie = async (req, res) => {
    const {
        contentType,
        title,
        detailss,
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
        detailss,
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
            releaseDate,
        });

        if (checkExist)
            return res.status(409).json({ message: "Movie already exists!" });

        const newMovie = new movieModel({
            contentType,
            title,
            detailss,
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
        res.status(201).json(saveMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

<<<<<<< HEAD
=======
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

>>>>>>> backend
// Get Movies by Category
exports.getMoviesByCategory = async (req, res) => {
    const { category } = req.params;
    const { limit } = req.query;

    try {
        const movies = await movieModel
            .find({ categories: category }, [
                "contentType",
                "banner",
                "title",
                "releaseDate",
            ])
            .sort({ releaseDate: -1 })
            .limit(limit);

        res.json(movies);
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
        const movie = await movieModel.findById(id, ["downloadLinks"]);
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
                    "details",
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
                    "details",
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
                    "details",
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
                    "details",
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
                    "details",
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
                    "details",
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
                    "details",
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
                    "details",
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
                    "details",
                    "poster",
                    "releaseDate",
                    "banner",
                ])
                .limit(20)
                .sort({ releaseDate: -1 }),
        ]);

        const movies = {
            movieBanner: {
                title: "featured",
                hasMore: false,
                items: featured,
                id: "banner1",
            },

            movieRows: [
                {
                    title: "latest movies",
                    hasMore: false,
                    items: latest,
                    id: "row1",
                    link: "/movies/category/latest",
                },
                {
                    title: "comedy movies",
                    hasMore: true,
                    items: comedy,
                    id: "row2",
                    link: "/movies/category/comedy",
                },
                {
                    title: "drama movies",
                    hasMore: true,
                    items: drama,
                    id: "row3",
                    link: "/movies/category/drama",
                },
                {
                    title: "family movies",
                    hasMore: true,
                    items: family,
                    id: "row4",
                    link: "/movies/category/family",
                },
                {
                    title: "crime movies",
                    hasMore: true,
                    items: crime,
                    id: "row5",
                    link: "/movies/category/crime",
                },
                {
                    title: "thriller movies",
                    hasMore: true,
                    items: thriller,
                    id: "row6",
                    link: "/movies/category/thriller",
                },
                {
                    title: "action movies",
                    hasMore: true,
                    items: action,
                    id: "row7",
                    link: "/movies/category/action",
                },
                {
                    title: "romance movies",
                    hasMore: true,
                    items: romance,
                    id: "row8",
                    link: "/movies/category/romance",
                },
                {
                    title: "horror movies",
                    hasMore: true,
                    items: horror,
                    id: "row9",
                    link: "/movies/category/horror",
                },
            ],
        };

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
