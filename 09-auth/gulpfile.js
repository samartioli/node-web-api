var gulp = require('gulp');

/**
 * NODE_ENV is used by Express also. `development` and `production`
**/
if (typeof process.env.NODE_ENV === 'undefined') {
    console.log('### INFO: NODE_ENV not defined. Setting it to production');
    process.env.NODE_ENV = 'production';
}

/**
 * Dynamically load gulp tasks defined in `gulp_tasks/`
 * Note: Variables are defined in `gulp_tasks/_variables.js`
 */
require('./gulp_tasks')();

/**
 * Define highest level tasks
 */

gulp.task('default', ['nodemon']);

gulp.task('analyze', ['jscshint'], function(cb) {cb();});

gulp.task('api', ['bpserver', 'watch'], function(cb) {cb();});

gulp.task('debug', ['inspector', 'nodemondebug'], function(cb) {cb();});

/**
 * To Debug
 *     .pipe(plugins.debug({verbose: false}))
 */
