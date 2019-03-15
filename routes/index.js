const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/user');

router.get('/', (req, res) => res.render('landing'));

// =============
// AUTH ROUTES
// =============

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to YelpCamp ${user.username}`);
      res.redirect('/campgrounds');
    });
  });
});

// =============
// LOGIN ROUTES
// =============
router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
  })
);

// =============
// LOGOUT ROUTES
// =============
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', `You have successfully logged out!`);
  res.redirect('/campgrounds');
});

module.exports = router;
