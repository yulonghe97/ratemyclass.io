
// Password Hasing
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


module.exports = {
    hashPassword: hashPassword,
    checkPassword: checkPassword
}