var r = require('request').defaults({
    json: true
});

var async = require('async');

var passport = require('passport');
var authorize = require('../lib/authorize')();

module.exports = function(app) {

    /* Read */
    app.get('/pets', authorize.authorize, function (req, res) {

        async.parallel({
            cat: function(callback){
                r({uri: 'http://localhost:3000/cat'}, function(error, response, body) {
                    if (error) {
                        callback({service: 'cat', error: error});
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body);
                    } else {
                        callback(response.statusCode);
                    }
                });
            },
            dog: function(callback){
                r({uri: 'http://localhost:3001/dog'}, function(error, response, body) {
                    if (error) {
                        callback({service: 'dog', error: error});
                        return;
                    };
                    if (!error && response.statusCode === 200) {
                        callback(null, body);
                    } else {
                        callback(response.statusCode);
                    }
                });
            }
        },
        function(error, results) {
            res.json({
                error: error,
                results: results
            });
        });

    });

    app.post('/signup', passport.authenticate('local-signup'), signupPost);

    app.post('/login', passport.authenticate('local-login'), loginPost);

    app.get('/ping', authorize.authorize, ping);
};

ping = function(req, res) {
    res.json({pong: true});
};

signupPost = function(req, res) {
    authorize.sendToken(req, res);
};

loginPost = function(req, res) {
    authorize.sendToken(req, res);
};

