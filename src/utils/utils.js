// Password Hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// function to hash the password
function hashPassword(password, cb){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // pass back the hashed value
        cb(hash);
    });
}

// function to check the password
function checkPassword(password, hash, cb){
    bcrypt.compare(password, hash, function(err, result) {
        // pass back the result
        cb(result);
    });
}

function isValidPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
}


function getRandom() {
    const randomImgIndex = Math.floor(Math.random() * Math.floor(3));
    return {
        url: `/random/${randomImgIndex}.png`,
    };
}

module.exports = {
    hashPassword: hashPassword,
    checkPassword: checkPassword,
    isValidPassword: isValidPassword,
    getRandom: getRandom
};