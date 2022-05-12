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
exports.getContentRows = async (req, res) => {
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
