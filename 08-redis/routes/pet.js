var r = require('request').defaults({
    json: true
});

var redis = require('redis');

var client = redis.createClient(6379, '127.0.0.1');

module.exports = function(app) {

    /* Read */
    app.get('/catname/:id', function (req, res) {

        client.get(req.params.id, function(error, cat) {
            if (error) {throw error;};
            if (cat) {
                res.json(JSON.parse(cat));
            } else {
                r({uri: 'http://localhost:3000/cat/' + req.params.id}, function(error, response, body) {
                    if (error) {throw error;return};
                    if (!error && response.statusCode === 200) {
                        res.json(body);
                        client.set(req.params.id, JSON.stringify(body), function (error) {
                            if (error) {throw error;};
                        });
                    } else {
                        res.send(response.statusCode);
                    }
                });
            }
        });

    });

};


// client.setex(req.params.id, 10, JSON.stringify(body), function (error) {
