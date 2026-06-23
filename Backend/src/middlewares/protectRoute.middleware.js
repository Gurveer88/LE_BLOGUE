import jwt from 'jsonwebtoken';
import {ENV} from '../lib/env.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({status: "failed", message: "No token provided, authorization denied"});
        }
        const decodedUser = await jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedUser.userId
        console.log(req.user);
        next();
    }
    catch(err){
        console.error("Error in protectRoute middleware:", err.message); // Use console.error
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        return res.status(500).json({ message: "Internal server error during authentication" });
    }
}