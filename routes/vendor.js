const express = require("express");
const router = express.Router();
const vendor = require("../controller/vendor");

const authorization = require('../middleware/auth');

//VENDOR ROUTE START
router.get("/all/bids", authorization, vendor.getBids);
router.get('/bids',authorization, vendor.getBidsByUserId);
router.get('/bid/:id',authorization, vendor.getBidById);
router.post('/bid', authorization, vendor.createBid);
router.delete('/bid/:id', authorization, vendor.deleteBid);
router.get('/bids/by/status', authorization, vendor.getBidsByStatus);
router.get('/bids/by/job', authorization, vendor.getBidsByJobId);
router.put('/status', authorization, vendor.updatestatus);
//VENDOR ROUTE END

module.exports = router;