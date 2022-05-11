module.exports = class {
    constructor(id, category, contentType, items, hasLink) {
        this.id = `row_${id}`;
        this.title = `${category} ${contentType}s`;
        (this.link = hasLink && `/${contentType}s/category/${category}`),
            (this.items = items);
    }
};
