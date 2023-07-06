var express = require('express');
var router = express.Router();
 
router.use('/user', require('./api/user'));
router.use('/company', require('./api/company'));
router.use('/vendor', require('./api/vendor'));
module.exports = router;
