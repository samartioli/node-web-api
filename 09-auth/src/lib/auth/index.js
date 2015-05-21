var passport = require('passport');
var router = require('./routes')();
var models = require('./models');
var middleware = require('./middleware')();


module.exports = function() {

    var auth = {
        router: router,
        models: models,
        mw: middleware
    };

    return auth;

};
