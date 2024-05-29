const jwt = require('jsonwebtoken');
require('dotenv').config();

function verify_doctor(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                error: "Unauthorized - No token",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decoded.role !== 'doctor') {
            return res.status(401).json({
                error: "Unauthorized - Invalid role",
            });
        }
        if (!decoded.id) {
            return res.status(401).json({
                error: "Unauthorized - Invalid ID",
            });
        }

        req.id = decoded.id;
        req.role = decoded.role;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            error: "Internal Server Error",
        });
        
    }
}

module.exports = {verify_doctor};