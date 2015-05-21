var auth = require('auth')();
var User = auth.models.get('user');
var Group = auth.models.get('group');
var async = require('async');
var _ = require('lodash');

var ping;
var init;
var populate;
var implode;

module.exports = function(router) {


    router.route('/ping')
        .get(ping);

    router.route('/init')
        .get(init);

    router.route('/populate')
        .get(populate);

    router.route('/implode')
        .get(implode);

};

ping = function(req, res) {res.send('pong');};

init = function(req, res) {

    var parallelGroupsArray = [];
    var parallelUsersArray = [];

    var groups = [
        {
            name: 'root',
            access: 0
        },
        {
            name: 'admin',
            access: 5
        },
        {
            name: 'registered',
            access: 10
        },
        {
            name: 'guest',
            access: 15
        }
    ];

    var groupRefs = {};

    _.forEach(groups, function(value) {
        parallelGroupsArray.push(function(value) {

            return (function(callback) {

                groupRefs[value.name] = new Group({
                    name: value.name,
                    access: value.access
                });

                groupRefs[value.name].save(function(err) {
                    if (err) {
                        throw err;
                    }
                    callback(null, 'group-' + value.name);
                });

            });
        }(value));
    });

    var users = [
        {
            email: 'root@root',
            groups: function() { return groupRefs.root._id; },
            password: 'root'
        },
        {
            email: 'admin@admin',
            groups: function() { return groupRefs.admin._id; },
            password: 'admin'
        }
    ];

    _.forEach(users, function(value) {
        parallelUsersArray.push(function(value) {

            return (function(callback) {

                var newUser = new User({
                    local: {
                        email: value.email
                    },
                    groups: value.groups()
                });

                newUser.local.password = newUser.generateHash(value.password);

                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    callback(null, 'user' + value.email);
                });

            });
        }(value));
    });

    async.parallelLimit(parallelGroupsArray, 10,
        function(err, results){
            async.parallelLimit(parallelUsersArray, 10,
                function(err, results){
                    res.send('Inited Users and Groups');
                }
            );
        }
    );

}

populate = function(req, res) {

    var parallelArray = [];

    var admin;
    var registered;

    async.parallelLimit([
        function(callback) {
            Group.findOne({name:'admin'})
                .exec(function(err, value) {
                    admin = value;
                    callback(null, 'admin');
                });
        },
        function(callback) {
            Group.findOne({name:'registered'})
                .exec(function(err, value) {
                    registered = value;
                    callback(null, 'registered');
                });
        }]
        , 10,
        function(err, results){

            console.log(admin);

            for (var x=0; x<20; x++) {

                parallelArray.push(function(x) {

                    return (function(callback) {

                        var newUser = new User({
                            local: {
                                email: 'asd' + x + '@test.com'
                            },
                            groups: [registered._id]
                        });

                        if (Math.floor(Math.random()*2) == 1) {
                            newUser.groups.push(admin._id);
                        }

                        newUser.local.password = newUser.generateHash('123');

                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            callback(null, 'user' + x);
                        });

                    });
                }(x)
                );
            }

            async.parallelLimit(parallelArray, 20,
                function(err, results){
                    res.send('Added Users and Groups');
                }
            );

        }
    );

};

implode = function(req, res) {

    async.parallel([
        function(callback){
            User.remove({}, function(err) {
                if (err) {
                    throw err;
                }
                callback(null, 'user');
            });
        },
        function(callback){
            Group.remove({}, function(err) {
                if (err) {
                    throw err;
                }
                callback(null, 'group');
            });
        }
    ],
    function(err, results){
        res.send('Users and Groups removed');
    });

};

