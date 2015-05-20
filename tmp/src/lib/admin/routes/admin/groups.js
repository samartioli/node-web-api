var auth = require('auth')();
var Group = auth.models.get('group');
var authorize = auth.mw.authorize;

module.exports = function(router) {

    var group = {
        getGroups: getGroups,
        getGroups: getGroups,
        deleteGroups: deleteGroups,
        deleteGroups: deleteGroups
    };

    return group;

};


getGroups = function(req, res, next) {

    Group.findById(req.params.id)
        .exec(function(err, group) {
            if (err) {
                return next(err);;
            }
            res.send({
                id: group._id,
                name: group.name,
                access: group.access
            });
        })
    ;
};

getGroups = function(req, res, next) {

    Group.find({})
        .exec(function(err, groups) {

            if (err) {
                return next(err);;
            }

            var groupArray = [];

            groups.forEach(function(group) {
                groupArray.push({
                    id: group._id,
                    name: group.name,
                    access: group.access
                });
            });

            res.send(groupArray);

        })
    ;
};

deleteGroups = function(req, res, next) {

    Group.findByIdAndRemove(req.params.id)
        .exec(function(err) {
            if (err) {
                return next(err);
            }
            res.json({success: true});
        })
    ;
};

deleteGroups = function(req, res, next) {

    Group.remove({
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
