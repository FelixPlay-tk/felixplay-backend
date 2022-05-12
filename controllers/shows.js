const showsModel = require("../model/showsModel");
const { FAKE_SHOWS } = require("../data/data");

// Get All Shows ID
exports.getAllShowsID = async (req, res) => {
    try {
        const shows_IDs = await showsModel.find(null, ["contentType"]);
        res.json(shows_IDs);
    } catch {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// Add New Show
exports.addNewShow = async (req, res) => {
    const {
        title,
        details,
        language,
        poster,
        banner,
        platform,
        categories,
        releaseDate,
        region,
        episodes,
    } = req.body;

    if (
        !(title,
        details,
        language,
        poster,
        banner,
        platform,
        categories,
        releaseDate,
        region,
        episodes)
    )
        return res.status(400).json({ message: "All fields are required!" });

    try {
        const checkExist = await showsModel.findOne({
            title,
            language,
            releaseDate,
        });

        if (checkExist)
            return res.status(409).json({ message: "Show already exists!" });

        const newShow = new showsModel({
            contentType: "show",
            title,
            details,
            language,
            poster,
            banner,
            platform,
            categories,
            releaseDate,
            region,
            episodes,
        });

        const saveShow = await newShow.save();
        res.status(201).json(saveShow);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Shows
exports.getAllShows = async (req, res) => {
    const page = +req.query.page;
    const limit = 30;

    const result = {
        hasNext: false,
    };

    try {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const length = await showsModel.find().countDocuments();

        if (endIndex < length) {
            result.hasNext = true;
        }

        const shows = await showsModel
            .find(null, [
                "contentType",
                "banner",
                "poster",
                "title",
                "releaseDate",
            ])
            .sort({ releaseDate: -1 })
            .skip(startIndex)
            .limit(limit);

        result.items = shows;

        res.json(result);
    } catch {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// Get Shows by Platforms
exports.getShowsByPlatform = async (req, res) => {
    const { platform } = req.params;
    const page = +req.query.page;
    const limit = 30;

    const result = {
        hasNext: false,
    };

    try {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const length = await showsModel.find({ platform }).countDocuments();

        if (endIndex < length) {
            result.hasNext = true;
        }

        const shows = await showsModel
            .find({ platform }, [
                "contentType",
                "banner",
                "poster",
                "title",
                "releaseDate",
            ])
            .sort({ releaseDate: -1 })
            .skip(startIndex)
            .limit(limit);

        result.items = shows;

        res.json(result);
    } catch {
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

// Get Single Show
exports.getSingleShow = async (req, res) => {
    const { id } = req.params;

    try {
        const show = await showsModel
            .findById(id)
            .select("-__v -updatedAt -createdAt");

        res.json(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Download links of a Show
exports.getEpisodeLinks = async (req, res) => {
    const { id } = req.params;

    try {
        const episodeLinks = await showsModel.findById(id, ["episodes"]);

        res.json(episodeLinks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
