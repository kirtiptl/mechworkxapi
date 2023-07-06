const jwt = require("jsonwebtoken");
const express = require("express");
const app = express(); // express app
require("dotenv").config();
const appError = require('../utils/appError');

const authorization = (req, res, next) => {

    try {
        const verifyToken = req.headers.authorization;
        if (verifyToken) {
            //UPDATE THE KEY IN ENV FILE
            const bearer = verifyToken.split(" ");
            const token  = bearer[1];
            jwt.verify(token, process.env.JWT_API_KEY);
            next();
        } else {
            throw new appError('Token is not valid', 401)
        }
    } catch (error) {
        next(error);
    }

}
module.exports = authorization;