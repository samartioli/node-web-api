var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {

    // asynchronous
    process.nextTick(function() {
        User.findOne({'local.email' :  email.toLowerCase()}, function(err, user) {
            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            var error = new Error();

            // if no user is found, return the message
            if (!user) {
                error.custom = 'incorrect-username';
                return done(error);
            }

            if (!user.validPassword(password)) {
                error.custom = 'incorrect-password';
                return done(error);
            } else {

                return done(null, user);
            }
        });
    });

}));

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
},
function(req, email, password, done) {

    // asynchronous
    process.nextTick(function() {

        //  Whether we're signing up or connecting an account, we'll need
        //  to know if the email address is in use.
        User.findOne({'local.email': email.toLowerCase()}, function(err, existingUser) {

            // if there are any errors, return the error
            if (err) {
                return done(err);
            }

            // check to see if there's already a user with that email
            if (existingUser) {
                //return done(null, false, {message: 'Email taken.'});
                var error = new Error();
                error.custom = 'email-already-taken';
                return done(error);
            }

            //  If we're logged in, we're connecting a new local account.
            if (req.user) {
                var user            = req.user;
                user.local.email    = email.toLowerCase();
                user.local.password = user.generateHash(password);
                user.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, user);
                });
            } else {
                console.log('create');
                // create the user
                var newUser            = new User();

                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }

                    return done(null, newUser);
                });
            }

        });
    });

}));

