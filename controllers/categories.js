const {
    moviesCategoryModel,
    showsCategoryModel,
    animesCategoryModel,
} = require("../model/categoryModel");

exports.getMoviesCategory = async (req, res) => {
    try {
        const data = await moviesCategoryModel.find();
        if (!data)
            return res.status(404).json({ message: "No categories found!" });
        const categoryNames = data.map((category) => ({ name: category.name }));
        return res.json(categoryNames);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!" });
    }
};
exports.getShowsCategory = async (req, res) => {
    try {
        const data = await showsCategoryModel.find();
        if (!data)
            return res.status(404).json({ message: "No categories found!" });
        const categoryNames = data.map((category) => ({ name: category.name }));
        return res.json(categoryNames);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!" });
    }
};
exports.getAnimesCategory = async (req, res) => {
    try {
        const data = await animesCategoryModel.find();
        if (!data)
            return res.status(404).json({ message: "No categories found!" });
        const categoryNames = data.map((category) => ({ name: category.name }));
        return res.json(categoryNames);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!" });
    }
};

exports.createMoviesCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is Required" });

    try {
        const newCategory = new moviesCategoryModel({ name });
        const saveCategory = await newCategory.save();
        if (saveCategory) return res.status(200).json(saveCategory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createShowsCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is Required" });

    try {
        const newCategory = new showsCategoryModel({ name });
        const saveCategory = await newCategory.save();

        if (saveCategory) return res.status(200).json(saveCategory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.createAnimesCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is Required" });

    try {
        const newCategory = new animesCategoryModel({ name });
        const saveCategory = await newCategory.save();

        if (saveCategory) return res.status(200).json(saveCategory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
