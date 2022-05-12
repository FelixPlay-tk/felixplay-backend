const Row = require("../classes/Row");
const movieModel = require("../model/movieModel");
const showsModel = require("../model/showsModel");

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
const getShow = (args) => {
    return showsModel
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

exports.search = async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query Missing!" });

    const items = [];

    try {
        const allItems = await Promise.all([
            movieModel
                .find({ title: { $regex: query, $options: "i" } }, [
                    "contentType",
                    "banner",
                    "title",
                ])
                .sort({ releaseDate: -1 }),

            showsModel
                .find({ title: { $regex: query, $options: "i" } }, [
                    "contentType",
                    "banner",
                    "title",
                ])
                .sort({ releaseDate: -1 }),
        ]);

        for (let index = 0; index < allItems.length; index++) {
            for (let j = 0; j < allItems[index].length; j++) {
                items.push(allItems[index][j]);
            }
        }

        if (items.length === 0)
            return res.status(404).json({ message: "No Result Found" });

        items.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Featured Movies
exports.getFeatured = async (req, res) => {
    try {
        const items = [];

        const allItems = await Promise.all([
            showsModel
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

            movieModel
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
        ]);

        for (let index = 0; index < allItems.length; index++) {
            for (let j = 0; j < allItems[index].length; j++) {
                items.push(allItems[index][j]);
            }
        }
        items.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        res.json(items);
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
            getShow(),
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
            latestMovies,
            latestShows,
            comedyMovies,
            dramaMovies,
            mysteryMovies,
            familyMovies,
            crimeMovies,
            thrillerMovies,
            actionMovies,
            romanceMovies,
            horrorMovies,
        ] = allRows;

        const movies = [
            new Row("latestMovies", "latest", "movie", latestMovies),
            new Row("latestShows", "latest", "Show", latestShows),
            new Row("comedyMovies", "comedy", "movie", comedyMovies, true),
            new Row("dramaMovies", "drama", "movie", dramaMovies, true),
            new Row("mysteryMovies", "mystery", "movie", mysteryMovies, false),
            new Row("familyMovies", "family", "movie", familyMovies, true),
            new Row("crimeMovies", "crime", "movie", crimeMovies, true),
            new Row(
                "thrillerMovies",
                "thriller",
                "movie",
                thrillerMovies,
                true
            ),
            new Row("actionMovies", "action", "movie", actionMovies, true),
            new Row("romanceMovies", "romance", "movie", romanceMovies, true),
            new Row("horrorMovies", "horror", "movie", horrorMovies, true),
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

// const results = await movieModel
//     .find({ title: { $regex: query, $options: "i" } }, [
//         "contentType",
//         "banner",
//         "title",
//     ])
//     .sort({ releaseDate: -1 });

// if (results.length === 0)
//     return res.status(404).json({ message: "No Result Found" });

// const shows = await showsModel
//     .find(null, [
//         "contentType",
//         "title",
//         "language",
//         "details",
//         "banner",
//         "releaseDate",
//         "categories",
//         "languages",
//         "runtime",
//     ])
//     .sort({ releaseDate: -1 })
//     .limit(5);

// const movies = await movieModel
//     .find(null, [
//         "contentType",
//         "title",
//         "language",
//         "details",
//         "banner",
//         "releaseDate",
//         "categories",
//         "languages",
//         "runtime",
//     ])
//     .sort({ releaseDate: -1 })
//     .limit(5);

// shows.map((show) => items.push(show));
// movies.map((movie) => items.push(movie));

// items.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
