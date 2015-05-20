var users = require('./users')();
var groups = require('./groups')();

module.exports = function(router) {

    router.route('/ping')
        .get(ping);

    router.route('/user/:id')
        .get(users.getUsers);

    router.route('/users')
        .get(users.getUsers);

    router.route('/user/:id')
        .delete(users.deleteUsers);

    router.route('/users')
        .put(users.deleteUsers);

    router.route('/group/:id')
        .get(groups.getGroups);

    router.route('/groups')
        .get(groups.getGroups);

    router.route('/group/:id')
        .delete(groups.deleteGroups);

    router.route('/groups')
        .put(groups.deleteGroups);

};

ping = function(req, res) {res.send('pong');};
