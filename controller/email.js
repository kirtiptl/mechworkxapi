const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const appError = require('../utils/appError');
const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");
// const hbs = require('nodemailer-express-handlebars');
const path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();
var hbs = exphbs.create({ /* config */ });

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

exports.sendingEmail = catchAsync(async (req, res, next) => {

    const userEmail = req.body.userEmail;
    const subject   = req.body.subject;
    const emailTempletName=  req.body.emailTempletName
    const dynamicData = req.body.dynamicData
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMIAL,
            pass: process.env.PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./views/'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views/'),
    };

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))


    var mailOptions = {
        from: process.env.EMIAL, // sender address
        to: userEmail, // list of receivers
        subject: subject,
        template: emailTempletName, // the name of the template file i.e email.handlebars
        context:dynamicData
    };

    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions).then(() => {
        return res.status(201).json({
            StatusCode: 201,
            message: "Email send successfully completed"
        })
    }).catch(error => {
        return res.status(201).json({
            error
        })
    })
});
