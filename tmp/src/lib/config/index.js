module.exports = (function() {

    var env = process.env.NODE_ENV;
    var fs = require('fs');
    var path = require('path');
    var _ = require('lodash');

    var toReturn = {};
    var local = null;
    var config = {};

    config.base = {
        env: 'base',
        redis: {
            store: {
                host: '127.0.0.1',
                port: 6379
            },
            secret: 'mybabysgotasecret'
        },
        mongo: {
            url: 'mongodb://localhost/node-web-api-webapi',

        },
        auth : {
            jwtSecret: 'oneplusoneequalsthree',
            facebookAuth : {
                clientID      : '734672879957650',
                clientSecret  : 'a0b40e4226ac89baf0507dbfdd383597',
                callbackURL   : 'http://localhost:8080/models/facebook/callback'
            },

            twitterAuth : {
                consumerKey       : 'HAXbd5xjBGqQ87oHdAytDImGq',
                consumerSecret    : 'YFJxDavHujn6kEUwZ1Y1Qd1YB6m9UbbiOBiq9NQJ9ThGQiqPCp',
                callbackURL       : 'http://localhost:8080/models/twitter/callback'
            },

            googleAuth : {
                clientID      : '818918308312-hn677frikdfa3fpmd6pkv2r9pbem0j0n.apps.googleusercontent.com',
                clientSecret  : 'du8KI7qcZLvQ5_HFlXIwydkh',
                callbackURL   : 'http://localhost:8080/models/google/callback'
            }
        }
    };

    config.docker = {
        env: 'docker',
        redis: {
            port: process.env.REDIS_PORT_6379_TCP_PORT,
            host: process.env.REDIS_PORT_6379_TCP_ADDR
        }
    };

    config.development = {
        env: 'development'
    };

    config.latest = {
        env: 'latest'
    };

    if (fs.existsSync(path.join(path.dirname(fs.realpathSync(__filename)), 'local.js'))) {
        console.log('### INFO: lib/config/local.js exists. Using it to override lib/config/index.js');
        local = require('./local.js');
    } else {
        console.log('### INFO: lib/config/local.js does not exist. ' +
            'Create one if you need to override anything in lib/config/index.js');
    }

    toReturn = _.merge(config.base, config[env]);

    if (local !== null) {
        toReturn = _.merge(toReturn, local);
    }

    return toReturn;

}());
