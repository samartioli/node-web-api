var passport = require('passport');
var mw = require('../../middleware')();

var ping;
var signupPost;
var loginPost;

module.exports = function(router) {

    router.route('/ping')
        .get(mw.authorize, ping);

    router.route('/signup')
        .post(passport.authenticate('local-signup'), signupPost);

    router.route('/login')
        .post(passport.authenticate('local-login'), loginPost);

};

ping = function(req, res) {
    req.log.info('PONG!');
    res.send('pong');
};

signupPost = function(req, res) {
    mw.sendToken(req, res);
};

loginPost = function(req, res) {
    mw.sendToken(req, res);
};

