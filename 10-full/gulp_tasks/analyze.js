var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

module.exports = function(gv) {

    gulp.task('jshint', function(cb) {
        return gulp.src(gv.analyzeJsGlobs)
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('jshint-stylish-ex'));
    });

    gulp.task('jscs', function(cb) {
        return gulp.src(gv.analyzeJsGlobs)
            .pipe(plugins.jscs())
            .on('error', plugins.util.noop)
            .pipe(plugins.jscsStylish())
            ;
    });

    /**
     * Run both jscs and jshint and combine the output
     */
    gulp.task('jscshint', function(cb) {
        return gulp.src(gv.analyzeJsGlobs)
            .pipe(plugins.jshint())
            .pipe(plugins.jscs())
            .on('error', plugins.util.noop)
            .pipe(plugins.jscsStylish.combineWithHintResults())   // combine with jshint results
            .pipe(plugins.jshint.reporter('jshint-stylish-ex'));
    });

};
