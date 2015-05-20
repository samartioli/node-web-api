var auth = require('auth')();
var User = auth.models.get('user');
var Group = auth.models.get('group');
var authorize = auth.mw.authorize;
var async = require('async');
var _ = require('lodash');

module.exports = function(router) {

    var user = {
        getUsers: getUsers,
        getUsers: getUsers,
        deleteUsers: deleteUsers,
        deleteUsers: deleteUsers
    };

    return user;

};

getUsers = function(req, res, next) {

    User.findById(req.params.id)
        .populate('groups', 'name')
        .exec(function(err, user) {
            if (err) {
                return next(err);;
            }
            res.send({
                id: user._id,
                email: user.local.email,
                groups: user.groups
            });
        })
    ;
};

getUsers = function(req, res, next) {

    async.waterfall([
        function(callback) {
            Group.find({})
                .exec(function(err, groups) {
                    if (err) {
                        return next(err);;
                    }
                    callback(null, groups);
                })
            ;
        },
        function(groups, callback) {
            User.find({})
                .populate('groups', 'name id')
                .exec(function(err, users) {
                    if (err) {
                        return next(err);
                    }
                    var userArray = [];
                    users.forEach(function(user) {

                        var asd = user.groups.map(function(item){
                            return item.toObject();
                        })

                        var tmpArray = [];
                        var groupIterator;
                        _.forEach(groups, function(value) {
                            if(groupIterator = _.find(asd, {name: value.name})) {
                                groupIterator.ticked = true;
                                tmpArray.push(groupIterator);
                            } else {
                                value.ticked = false;
                                tmpArray.push(value);
                            }

                        })


                        userArray.push({
                            id: user._id,
                            email: user.local.email,
                            groups: tmpArray
                        });
                    });
                    res.send(userArray);
                })
            ;
        }
        ], function (err, result) {
        if (err) {
            return next(err);;
        }
    });

};

deleteUsers = function(req, res, next) {

    User.findByIdAndRemove(req.params.id)
        .exec(function(err) {
            if (err) {
                return next(err);
            }
            res.json({success: true});
        })
    ;
};

deleteUsers = function(req, res, next) {

    console.log(req.body.ids);

    User.remove({
            _id: {
                $in: req.body.ids
            }
        })
        .exec(function(err) {

            if (err) {
                return next(err);
            }

            res.json({success: true});

        })
    ;

};
