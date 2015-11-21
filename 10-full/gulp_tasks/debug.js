var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

module.exports = function(gv) {

    gulp.task('inspector', function() {

        gulp.src([])
            .pipe(plugins.nodeInspector());

    });

    gulp.task('nodemondebug', function() {
        plugins.nodemon({
                script: gv.indexPath,
                // nodeArgs: ['--debug'],
                nodeArgs: ['--debug-brk'],
                ext: 'js',
                ignore: ['node_modules/**'],
                env: {
                    NODE_PATH: gv.libPath,
                    NODE_ENV: 'development'
                }
            })
            .on('change', ['jscshint'])
            .on('restart', function() {
                console.log('restarted!');
            });
    });

};
