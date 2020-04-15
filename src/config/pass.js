// Passport.JS Configuration

const LocalStrategy = require('passport-local').Strategy,
      db = require('./db'),
      passport = require('passport'),
      utils = require('../utils/utils');

// PASSPORT
passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    db.User.findById(id, function (err, user) {
        done(err, user);
    })
});

passport.use('login', new LocalStrategy({
    passReqToCallback: true
   }, function (req, username, password, done) {
    db.User.findOne({'username': username},
        function (err, user) {
            if (err) return done(err);
            if (!user) {
                // Username does not exist
                console.log(`User Not Found with username: ${username}`);
                return done(null, false, req.flash('message', 'User Not found.'));
            }
            //Username exist but password is incorrect
            if (!utils.isValidPassword(user, password)) {
                console.log(`Invalid Password.`);
                return done(null, false, req.flash('message', 'Invalid Password'));
            }
            // User and password both match, return user from
            // done method, treat as success.
            // save user information to cookie
            return done(null, user);
        })
}));

console.log(`Passport Strategy Loaded`);

module.exports = passport;