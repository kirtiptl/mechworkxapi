const express = require("express");
const app = express(); // express app
const PORT = 4000;

const db = require('./db');
db.connect();
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const USER_ROUTES = require("./routes/user");
const COMPANY_ROUTES = require('./routes/company');
const VENDOR_ROUTES = require('./routes/vendor');
const MASTER_ROUTES =require('./routes/master');

const appError = require("./utils/appError");
const errorController = require('./utils/errorController');

const cors = require('cors');
app.use(express.json());

app.use(cors());

app.use("/api/user", USER_ROUTES);
app.use("/api/company", COMPANY_ROUTES);
app.use("/api/vendor", VENDOR_ROUTES);
app.use("/api/master",MASTER_ROUTES)

app.use("/api2", require('./routes2'));

app.all('*', (req, res, next) => {
    throw new appError(`Requested URL ${req.path} not found`, 404);
});

app.use(errorController);

//server starts listening for any attempts from a client to connect at port: {port}
app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});




