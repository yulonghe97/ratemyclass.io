// user.js will contain the methods for user operation.
const university = require('./university'),
      mongoose = require("mongoose"),
      User = mongoose.model("User"),
      passport = require('passport'),
      utils = require('../utils/utils');

// EXPRESS APP

exports.indexPage = (req, res) => {
    if (req.user) {
        // User Signed In
        res.render("index.hbs",
            {
                userNickname: req.user.userNickname,
                signedOut: false,
                avatar: req.user.userAvatarUrl,
            });
    } else {
        res.render("index.hbs", {signedOut: true});
    }
};

// User Login/Logout
exports.userLoginGet = (req, res) => {
    if(req.user){
        res.redirect('/');
        return
    }
    res.render("userLogin.hbs", {
        Error: req.flash('message'),
        signedOut: true
    });
};

// authentication middleware
exports.userLoginPost = (req, res, next) => {
    passport.authenticate('login',
        {
            failureFlash: true,
            failureRedirect: '/userLogin',
            successRedirect: '/'
        })(req, res, next);
};

// User Logout
exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};


// User Registration
exports.userRegGet = (req, res) => {
    if(req.user){
        res.redirect('/');
        return
    }
    res.render("userReg.hbs", {signedOut: true});
};
exports.userRegPost = (req, res) => {
    const userData = req.body;
    // find the university ID
    university.findUniversity(userData.userUniversity, (err, university) => {
        if (err) {
            res.render("error.hbs", {
                Error: err,
            });
        } else {
            // Save user after getting the university
            // Hash the password
            utils.hashPassword(userData.password, (hashedPassword) => {
                // Register User
                //download Avatar
                console.log(userData);
                utils.downloadAvatar(userData.avatarURL).then(()=>{
                   const avatarPath = '/img/avatar/' + userData.avatarURL.substring(userData.avatarURL.lastIndexOf('/') + 1);
                    regUser(
                        userData.username,
                        hashedPassword,
                        userData.userEmail,
                        userData.userNickname,
                        userData.userUniversity,
                        avatarPath
                        , (user) => {
                            // automatically login User after registration
                            req.login(user, function(err) {
                                if (err) { return next(err); }
                                return res.redirect('/');
                            });
                        })
                });
            });
        }
    });
};


// User Profile
exports.getUserProfile = (req, res) =>{
    res.render("profile.hbs",{
        userNickname: req.user.userNickname,
        school: req.user.userUniversity,
        avatar: req.user.userAvatarUrl
    });
};



// --- User-Related Methods ---


// TODO: ERROR HANDLING

// Register User
function regUser(
    username,
    password,
    userEmail,
    userNickname,
    userUniversity,
    userAvatarUrl,
    cb) {
    const newUser = new User({
        username: username,
        password: password,
        userEmail: userEmail || "",
        userNickname: userNickname,
        userUniversity: userUniversity,
        userDateCreated: Date.now(),
        userAvatarUrl: userAvatarUrl,
        followedClass: [],
        reviews: [],
    });
    newUser.save((err, user) => {
        err ? console.log(err) : console.log(`User ID ${user._id} Saved.`);
        // update the related university with new user
        university.University.findOneAndUpdate({universityName: user.userUniversity}, {$push: {universityUsers: user._id}}, (err, res) => {
            err ? console.log(err) : console.log(`User Added to the ${res.universityName}`);
        });
        // pass back the user
        cb(user);
    });
}

// Check if user exist
exports.checkUserExistance = (user, cb) => {
    User.findOne({username: user}, (err, user) => {
        // If the user exist, return 1, else return 0
        user !== null ? cb('1') : cb('0')
    });
};


// function to check if user is authenticated.
exports.checkAuthentication = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('message', 'Unauthenticated Access. Please Login.');
        // Store user's last visit
        req.session.redirectTo = req.originalUrl;
        res.redirect('/userLogin');
    }
};


