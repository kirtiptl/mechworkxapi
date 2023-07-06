const express = require("express");
const router = express.Router();
const master = require("../controller/master");

const authorization = require('../middleware/auth');

router.get("/category",authorization,master.getcategory);
router.get("/job-works",authorization,master.getjobwork);
router.get("/material",authorization,master.getmaterial);
router.get("/job-work",authorization,master.getjobworkbyid);

module.exports = router;