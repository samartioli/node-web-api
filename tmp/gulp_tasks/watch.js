var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

module.exports = function(gv) {

    gulp.task('watch', function() {

        plugins.watch('src/routing/routes', {
                verbose: true,
                base: gv.srcPath
            })
            .pipe(plugins.aglio({template: 'flatly'}))
            .pipe(gulp.dest('docs'));

    });

};
