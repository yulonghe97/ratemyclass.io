// Router for handling routes
const router = require('express').Router(),
      user = require('./controller/user'),
      api = require('./api/api'),
      search = require('./controller/search');
      Class = require('./controller/class');
      review = require('./controller/review');


// Index Page
router.get('/', user.indexPage);

// Search Page
router.get('/search', search.getSearchPage);

// User Login/Reg
router
    .route('/userLogin')
    .get(user.userLoginGet)
    .post(user.userLoginPost);

router.get('/logout', user.logout);
router.get('/userReg', user.userRegGet);
router.post('/reg', user.userRegPost);

// User Profile
router.get('/profile', user.checkAuthentication, user.getUserProfile);

// Review
router.post('/addReview', user.checkAuthentication, review.addReviewPost);

// Class
router
    .route('/addClass')
    .get(user.checkAuthentication, Class.getAddClass)
    .post(user.checkAuthentication, Class.postAddClass);

router.get('/class/:classId', Class.getViewClass);
router.get('/addSuccess', Class.getAddSuccess);

// API
router.get('/api/checkUser', api.checkUser);
router.get('/api/checkLogin', api.checkLogin);
// router.get('/api/:seed', api.getRandomAvatar);
router.get('/api/getReviews/:classId', api.getReview);
      // Class Search
router.get('/api/searchClass/:query', api.searchClass);

router.get('/api/saveU/:name/:abbr', api.saveUniversity);

// Error Page
router.get('/error', (req, res)=>{res.render('error', {Error: req.flash('error')})});
router.get('*', (req, res)=>{
      req.flash('error','404 page not found');
      res.redirect('/error')
});

// Redirect Handler
router.get('/redirect', (req, res) => {
      req.session.redirectTo ? res.redirect(req.session.redirectTo) : res.redirect('/profile');
});



module.exports = router;