var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var util = require('util');
var sh = require('shelljs');

module.exports = function(gv) {

    var projectPrefix = 'napi';
    var name = 'webapi';
    var imageName = projectPrefix + '-' + name;

    var buildJsonPath = path.join(gv.rootPath, 'build.json');
    var pkgPath = path.join(gv.rootPath, 'package.json');

    var pkg = require(pkgPath);
    var build = require(buildJsonPath);

    gulp.task('dbuild', function(cb) {

        var newIteration = ('0000' + (parseInt(build.iteration) + 1)).slice(-4);
        var newVersion = pkg.version + '-' + newIteration;

        sh.exec(util.format('docker build -t %s:%s %s', imageName, newVersion, gv.rootPath));
        sh.exec(util.format('docker tag -f %s:%s %s:latest', imageName, newVersion, imageName));

        build.iteration = newIteration;
        fs.writeFileSync(buildJsonPath, JSON.stringify(build, null, 4));

        sh.exec(util.format('docker images %s', imageName), function(code, output) {
            console.log('### INFO: Finished');
            cb();
        });

    });

    gulp.task('drun', ['drm'], function(cb) {

        console.log('### INFO: Running Latest Container');

        sh.exec(
            util.format('docker run -d -p 3000:3000 --name %s %s',
                imageName,
                imageName
            ), function(code, output) {
            sh.exec(util.format('docker ps -a'), function(code, output) {
                console.log('### INFO: Finished');
                console.log('### NOTE: This is a volume container, so it will exit immediately.');
                cb();
            });
        });

    });

    gulp.task('drm', function(cb) {

        console.log('### INFO: Removing Running Container');
        sh.exec(util.format('docker rm -f %s', imageName), function(code, output) {
            console.log('### INFO: Removed Container');
            cb();
        });
    });

    gulp.task('dlog', function(cb) {

        console.log('### INFO: Loggin for %j', imageName);
        sh.exec(util.format('docker logs -f %s', imageName), function(code, output) {
            console.log('### INFO: Logs Completed');
            cb();
        });
    });

};
