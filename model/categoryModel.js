const { Schema, model } = require("mongoose");

const movieCategorySchema = Schema({
    name: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
});

const showsCategorySchema = Schema({
    name: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
});

const animesCategorySchema = Schema({
    name: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
});

const moviesCategoryModel = model("movieCategory", movieCategorySchema);
const showsCategoryModel = model("showsCategory", showsCategorySchema);
const animesCategoryModel = model("animesCategory", animesCategorySchema);

module.exports = {
    moviesCategoryModel,
    showsCategoryModel,
    animesCategoryModel,
};
