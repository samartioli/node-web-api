var fs = require('fs');
var path = require('path');

/*jshint latedef:false */

// variables that can be accessed from any tasks
module.exports = function() {

    return {
        rootPath: rootPath,
        srcPath: srcPath,
        analyzeJsGlobs: analyzeJsGlobs,
        indexPath: indexPath,
        libPath: libPath
    };

};

var rootPath = path.join(path.dirname(fs.realpathSync(__filename)), '../');
var srcPath = path.join(rootPath, 'src');
var indexPath = path.join(srcPath, 'index.js');
var libPath = path.join(srcPath, 'lib');

var analyzeJsGlobs = [
    './src/**/*.js',
    './gulpfile.js',
    './gulp_tasks/**/*.js'
];
