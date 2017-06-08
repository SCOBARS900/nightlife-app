var express = require('express');
var passport = require('passport');
var router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

router.get('/', function(req, res, next) {
    res.render('home.ejs');
});

router.get('/login', function(req, res) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/success',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/success',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.get('/success', isLoggedIn, function(req, res) {
  res.render('success.ejs');
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/success',
  failureRedirect: '/home',
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/success',
  failureRedirect: '/home',
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



























module.exports = router;