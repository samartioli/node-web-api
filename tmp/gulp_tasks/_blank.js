var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

module.exports = function(gv) {

    gulp.task('blank', function(cb) {

        return gulp.src('*')
            .pipe(plugins);
    });

};
