var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var _ = require('lodash');
var sh = require('shelljs');
var async = require('async');
var util = require('util');
var colors = require('colors');

module.exports = function(gv) {

    var pathToPj = path.join(gv.rootPath, 'package.json');
    var pj = require(pathToPj);
    var cb;

    gulp.task('packagejson', function(cbGulp) {

        cb = cbGulp;

        async.series({
            devDependencies: function(cbRuns) {
                _run('devDependencies', cbRuns);
            },
            dependencies: function(cbRuns) {
                _run('dependencies', cbRuns);
            }
        }, _runsCb);

    });

    var _run = function(dependencyKey, cbRuns) {

        console.log('### INFO: About to gether latest versions for %j', dependencyKey);

        var asyncObject = {};
        var latestVersions = {};

        _.forEach(pj[dependencyKey], function(value, key) {

            asyncObject[key] = function(cbVersions) {

                sh.exec('npm view ' + key + ' version', {silent:true}, function(code, output) {

                    process.stdout.write('.');

                    var current = value.replace(/^\^/, '');

                    cbVersions(null, {
                        current: current,
                        latest: output.trim()
                    });

                });
            };

        });

        async.parallelLimit(asyncObject, 12, function(err, results) {

            process.stdout.write('\n');

            var questions = [];

            _.forEach(results, function(value, key) {

                if (value.current !== value.latest) {

                    latestVersions[key] = value.latest;

                    questions.push({
                        type: 'confirm',
                        name: key,
                        message: util.format(
                            '%j - Current: %j, Latest: %j. Upgrade?',
                            key,
                            value.current,
                            value.latest
                        ),
                        default: true

                    });

                }

            });

            inquirer.prompt(questions, function(answers) {

                _.forEach(answers, function(value, key) {

                    if (value === true) {

                        pj[dependencyKey][key] = '^' + latestVersions[key];

                    }

                });

                cbRuns(null, pj[dependencyKey]);

            });

        });

    };

    var _runsCb = function(err, results) {

        var questions = [{
            type: 'confirm',
            name: 'update',
            message: 'Update package.json with new versions?',
            default: true
        },
        // {
        //     type: 'confirm',
        //     name: 'npminstall',
        //     message: 'npm install',
        //     default: true,
        //     when: function (answers) {
        //         return answers.update;
        //      }
        // }
        ];

        inquirer.prompt(questions, function(answers) {
            if (answers.update === true) {
                fs.writeFile(pathToPj, JSON.stringify(pj, null, 4), function(err) {
                    if (err) {throw err;}
                    console.log('### INFO: package.json has been updated');
                    console.log(colors.red.underline('### WARN: run `npm install` now to update your node_modules'));
                    cb();
                    // npm install does not work from exec for some reason...
                    // if (answers.npminstall) {
                    //     sh.cd(gv.rootPath);
                    //     sh.exec('npm install', {silent:false}, function(code, output) {
                    //         cb();
                    //     });
                    // };
                });
            }
        });

    };

};
