// API Handling

const user = require('../controller/user'),
      university = require('../controller/university'),
      utils = require('../utils/utils'),
      db = require('../config/db'),
      Review = require('../controller/review');

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

// Get Review from classID
exports.getReview = async (req, res)=>{
    console.log('API GET REVIEW REQUEST: '+ req.params.classId);
    try{
        const review = await db.Class
            .findById(req.params.classId)
            .populate('reviews')
            .lean()
            .exec();
        await res.json(review);
    }catch (e) {
        return utils.errHandle(e, req, res);
    }
};

// save university api, for test purpose
exports.saveUniversity = (req, res)=>{
    university.saveUniversity(req.params.name, req.params.abbr, (university)=>{
        res.send('University ' + university.universityName + ' Saved.');
    });
};

exports.getRandomAvatar = (req, res) =>{
    res.json(utils.getRandom());
};
