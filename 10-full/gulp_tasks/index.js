var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function() {

    var taskFiles = fs.readdirSync(
        path.dirname(
            fs.realpathSync(__filename)
        )
    );

    var gulpVariables = require('./_variables')();

    var notIndexOrUnderscore = function(t) {
        if (t === 'index.js' || t.match(/^_.*/)) {return false;}
        return true;
    };

    var requireMapFunction = function(t) {
        //console.log('### INFO: gulp_tasks requiring %j', t);
        require('./' + t)(gulpVariables);
    };

    _.map(
        _.filter(taskFiles, notIndexOrUnderscore),
        requireMapFunction
    );

};
