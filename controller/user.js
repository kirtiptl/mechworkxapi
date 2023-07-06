const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const appError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");


exports.createUser = async (req, res, next) => {
    try {
        let userDetail;
        const { username, password } = req.body;
        const user = req.body.username;
        const salt = await bcrypt.genSalt(10);
        const user_password = await bcrypt.hash(password, salt);
        // FETCH all registred users from database
        const selectUser = await pool.query(
            "SELECT user_name FROM users WHERE user_name = $1",
            [user]
        );
        // FIND requested username from fetched users.
        const filteredUser = selectUser.rows.find((res) => {
            return res.user_name;
        })
        // IF requested username is not existed in database then create the new one otherwise throw message.
        if (!filteredUser) {
            const newUser = await pool.query(
                "INSERT INTO users (user_name, password) VALUES($1, $2) RETURNING *",
                [username, user_password]
            );

            const fetchedUser = newUser.rows[0].user_name;
            userDetail = newUser.rows[0];

            res.json({
                message: "User created",
                username: fetchedUser
            });
        } else {
            throw new appError('User already exist with this username.', 403);
        }

    } catch (error) {
        next(error);
    }
}

exports.userLogin = catchAsync(async (req, res, next) => {
    const username = req.body.username;
    const user_pass = req.body.password;
    const user_type = req.body.user_type;

    if (username && user_pass && user_type) {
        const loggedUser = await pool.query(
            "SELECT * FROM users WHERE user_name = $1",
            [username]
        );

        if (loggedUser.rowCount > 0) {
            const fetchedUser = loggedUser.rows[0].user_name;
            const fetchedUserId = loggedUser.rows[0].user_id;
            const fetchedPassword = loggedUser.rows[0].password;
            const fetchedUserType = loggedUser.rows[0].user_type;
            const checkUserType = fetchedUserType == user_type;

            const comparePass = await bcrypt.compare(user_pass, fetchedPassword)
                .then((response) => {
                    return response;
                });

            if (fetchedUser && (comparePass == true) && checkUserType) {
                // CREATE TOKEN
                const token = jwt.sign(
                    { username: fetchedUser, user_id: fetchedUserId },
                    process.env.JWT_API_KEY,
                    {
                        expiresIn: "12h"
                    }
                );

                res.status(200).json({
                    statusCode: 200,
                    userDeatils: loggedUser.rows[0],
                    token: token,
                    message: "Logged in successfully"
                });
                res.end();

            } else if (fetchedUser && (comparePass != true)) {
                throw new appError('Password not matched', 404);

            } else if (!checkUserType) {
                throw new appError('User type not matched.', 404);

            }
        }
        else {
            throw new appError('User not found', 404);
        }
    }
    else {
        throw new appError('Missing Username, Password or User type.', 406);
    }
})
exports.getUsersByUsertype = catchAsync(async (req, res, next) => {
    const { user_type } = req.query;
    if (user_type) {
        const users = await pool.query("SELECT * FROM users WHERE user_type = $1", [user_type]);
        res.json({
            statusCode: 200,
            data: users.rows|| []
        });
    }
    else {
        throw new appError('Missing usertype', 406);
    }
})

exports.getUserDetail = catchAsync(async (req, res, next) => {
    const { user_type, user_id } = req.query;
    if (user_type && user_id) {
        const users = await pool.query(`SELECT * FROM users WHERE user_type=$1 AND user_id=$2`, [user_type, user_id]);
        res.json({
            statusCode: 200,
            data: users.rows || []
        });
    }
    else {
        throw new appError('Missing usertype', 406);
    }
})