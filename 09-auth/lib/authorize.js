var moment = require('moment');
var User = require('../models/user.js');
var jwt = require('jsonwebtoken');

module.exports = function() {

    var middleware =  {
        authorize: authorize,
        sendToken: sendToken
    }

    return middleware;

};
authorize = function(req, res, next) {

    var token = req.headers['x-access-token'];

    if (typeof(token) === 'undefined') {
        var error = new Error();
        error.custom = 'no-access-token';
        return next(error);
    }

    jwt.verify(token, 'jwtsecret', function(err, decoded) {

        if (err) {
            err.custom = 'can-not-verify-token';
            return next(err);
        }

        if (decoded.exp < moment().valueOf()) {
            var error = new Error();
            error.custom = 'token-expired';
            return next(error);
        }

        User.findById(decoded.iss, function(err, user) {

            if (err) {
                return next(err);
            }

            if (!user) {
                err.custom = 'user-not-found';
                return next(err);
            }

            return next();

        });

    });

};

sendToken = function(req, res) {

    var expires = moment().add(2, 'hours').valueOf();
    var token = jwt.sign({
        iss: req.user.id,
        exp: expires
    }, 'jwtsecret');

    res.json({
        token : token,
        email: req.user.local.email
    });

};
