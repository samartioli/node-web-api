var express = require('express');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function() {

    return router;

};

var router = express.Router();

var routeFiles = fs.readdirSync(
    path.dirname(
        fs.realpathSync(__filename)
    )
);

var notIndexOrUnderscore = function(t) {
    if (t === 'index.js' || t.match(/^_.*/)) {return false;}
    return true;
};

var requireMapFunction = function(t) {
    require('./' + t)(router);
};

_.map(
    _.filter(routeFiles, notIndexOrUnderscore),
    requireMapFunction
);
