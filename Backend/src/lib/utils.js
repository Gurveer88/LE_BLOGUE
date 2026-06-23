import jwt from 'jsonwebtoken';
import {ENV} from './env.js';

const JWT_SECRET = ENV.JWT_SECRET
export const generateToken = async (userId, res) => {
    const token = jwt.sign({userId}, JWT_SECRET, {expiresIn: '7d'});
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60,
        httpsOnly: true,
    });
    return token;
}