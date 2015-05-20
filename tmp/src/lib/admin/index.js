module.exports = function() {

    var admin = {
        router: require('./routes')()
    };

    return admin;

};
