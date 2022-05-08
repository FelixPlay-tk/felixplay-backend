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

const moviesCategoryModel = model("moviesCategory", movieCategorySchema);
const showsCategoryModel = model("showsCategory", showsCategorySchema);

module.exports = {
    moviesCategoryModel,
    showsCategoryModel,
};
