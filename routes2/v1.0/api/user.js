const express = require("express");
const router = express.Router();
const user = require('../../../controller/user');
const authorization = require('../../../middleware/auth');
// const email = require("../../../controller/email");

//USER ROUTE START
router.post("/singup", user.createUser);
router.post("/login", user.userLogin);
router.get("/list", authorization, user.getUsersByUsertype);
// router.post("/send/email", email.sendingEmail);
//USER ROUTE END
module.exports = router;
