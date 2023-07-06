var express = require('express');
var router = express.Router();
 
router.get('/demo', function(req, res, next) {
  res.send('Hello v2.0 GET API');
});
 
module.exports = router;
