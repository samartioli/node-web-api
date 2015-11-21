module.exports = function(app) {

    var errorHandler = function(err, req, res, next) {

        switch (err.custom) {
            case 'no-access-token': {
                res.status(401).send({error: 'No Access Token'});
                break;
            }
            case 'can-not-verify-token': {
                res.status(401).send({
                    error: 'Can Not Verify Access Token',
                    name: err.name,
                    message: err.message
                });
                break;
            }
            case 'user-not-found': {
                res.status(401).send({error: 'User Not Found'});
                break;
            }
            case 'token-expired': {
                res.status(401).send({error: 'Token Expired'});
                break;
            }
            case 'incorrect-username': {
                res.status(401).send({error: 'Incorrect Username'});
                break;
            }
            case 'incorrect-password': {
                res.status(401).send({error: 'Incorrect Password'});
                break;
            }
            case 'email-already-taken': {
                res.status(401).send({error: 'Email Already Taken'});
                break;
            }
            default: {
                next(err);
            }
        }

    };

    app.use(errorHandler);

};
