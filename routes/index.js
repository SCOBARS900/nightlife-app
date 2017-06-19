var express = require('express');
var passport = require('passport');
var yelp = require('yelp-fusion');
var router = express.Router();
var userFunctions = require('../controllers/userfunctions.js');
var yelpFunctions = require('../controllers/yelpfunctions.js');
var User = require('../models/user');
var Bar = require('../models/bar');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

function isLoggedInVote (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
    req.flash('authmessage', "You have to Login to show that you're going.");
    res.redirect('/');
    }
}


router.get('/', yelpFunctions.yelpCleanToday, userFunctions.userHasCity, function(req, res) {
    res.render('home.ejs', { authenticatemessage: req.flash('authmessage') });
});

router.get('/login', function(req, res) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.get('/success', isLoggedIn, function(req, res) {
  res.render('success.ejs');
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/',
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/',
}));


router.get('/search/:cityparam', yelpFunctions.yelpAuthenticate);

router.post('/search', userFunctions.userLastCity);
    

    
router.get('/bar/:barparam', yelpFunctions.yelpSpecific);
    


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


router.post('/registrybar', isLoggedInVote, yelpFunctions.yelpRegistry, yelpFunctions.yelpDelete );










module.exports = router;