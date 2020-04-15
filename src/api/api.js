// API Handling

const user = require('../controller/user'),
      utils = require('../utils/utils');

// Check if user exists
exports.checkUser = (req, res) => {
    user.checkUserExistance(req.query.username, (result) => {
        res.json({
            exist: result,
        });
    });
};

// Check if user is logged in
exports.checkLogin = (req, res) => {
    if (!req.user) {
        res.json({'loggedIn': false})
    } else {
        res.json({
            'loggedIn': true,
            'nickname': req.user.userNickname
        });
    }
};

exports.getRandomAvatar = (req, res) =>{
    res.json(utils.getRandom());
};

