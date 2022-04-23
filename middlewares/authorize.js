const jwt = require("jsonwebtoken");

exports.authorize = async (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(403).json({ message: "No Token Provided!" });

    const token = req.headers.authorization.split(" ")[1];

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = userData;
    } catch (error) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    next();
};
