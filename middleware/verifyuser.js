const jwt = require('jsonwebtoken');
require('dotenv').config()
exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.access_cookie;
        if (!token) {
            return res.status(401).json({ success: false, msg: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, msg: "Invalid token" });
    }
};
