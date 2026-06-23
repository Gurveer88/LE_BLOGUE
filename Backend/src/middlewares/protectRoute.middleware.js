import jwt from 'jsonwebtoken';
import {ENV} from '../lib/env.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decodedUser = await jwt.verify(token, ENV.JWT_SECRET);
        if (decodedUser) {
            req.user = decodedUser.userId
            console.log(req.user);
            next();
        }
        else{
            console.log("The user is not authorized");
        }
    }
    catch(err){
        console.log(err);
        return res.status(400).json({message: "Error in the protection route"});
    }
}