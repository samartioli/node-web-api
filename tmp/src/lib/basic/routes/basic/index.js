var config = require('config');

var ping;
var configuration;
var echo;

module.exports = function(router) {

    router.route('/echo/:name')
        .get(echo);

    router.route('/config')
        .get(configuration);

    router.route('/ping')
        .get(ping);

};

ping = function(req, res) {res.send('pong');};

configuration = function(req, res) {res.json(config);};

echo = function(req, res) {res.send('hello ' + req.params.name);};
