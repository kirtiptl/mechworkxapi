var express = require('express');
var router = express.Router();
 
router.use('/company', require('./api/company'));

module.exports = router;