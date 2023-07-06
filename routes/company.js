const express = require("express");
const router = express.Router();
const company = require("../controller/company");
const multer = require('multer');
const path = require('path');

const authorization = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })
  
const upload = multer({ storage: storage })

const multiUpload = upload.fields([{ name: 'data_file', maxCount: 2 }, { name: 'inspection_sheet', maxCount: 8 }, { name: 'other_documents', maxCount: 3 }])

//COMPANY ROUTE START
router.get("/all/jobs", authorization, company.getJobs);
router.get('/jobs',authorization, company.getJobsByUserId);
router.get('/job/:id',authorization, company.getJobById);
router.post('/job', authorization, company.createJob);
router.delete('/job/:id', authorization, company.deleteJob);
router.post('/files', multiUpload, company.uploadFiles);
router.put('/bid-status', authorization, company.updateByBidStatus);
//COMPANY ROUTE END

module.exports = router;