var config = require('config');
var express = require('express');
var app = express();
var passport = require('passport');
var port = process.env.PORT || 3000;
var bunyan = require('bunyan');
var bunyanMiddleware = require('bunyan-middleware');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');

var mongoose = require('mongoose');
mongoose.connect(config.mongo.url);

app.use(cors());

var logger = bunyan.createLogger({name: 'napi-webapi'});

app.use(
    bunyanMiddleware({
        headerName: 'X-Request-Id',
        propertyName: 'reqId',
        logName: 'req_id',
        obscureHeaders: [],
        logger: logger
    })
);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

var auth = require('auth')();
app.use('/api/latest/auth/', auth.router);
var strategies = require('strategies');

var basic = require('basic')();
app.use('/api/latest/basic/', basic.router);

var admin = require('admin')();
app.use('/api/latest/admin/', admin.router);

/**
 * Error Middleware must be declared last
 */
require('error')(app);

app.listen(port);
console.log('INFO: Listening on port %j', port);
