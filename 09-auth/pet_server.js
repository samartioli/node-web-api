var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var localStrategy = require('./lib/strategy');

var petRoutes = require('./routes/pet.js')(app);

var errors = require('./lib/errors')(app);

var server = app.listen(3002, function () {
    console.log('Server running at http://127.0.0.1:3002/');
});
