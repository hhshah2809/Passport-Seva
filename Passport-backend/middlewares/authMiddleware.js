const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
        req.user = decoded; // { id, role, iat, exp }
        next();
    });
};


module.exports = verifyToken;
