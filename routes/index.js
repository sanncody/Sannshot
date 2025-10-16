const express = require('express');
const userModel = require('../models/userModel');
const passport = require('passport');
const router = express.Router();
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/register', function (req, res) {
  res.render('register');
});

router.get('/profile', isLoggedIn, async function (req, res) {
  const user = await userModel.find();
  res.render('profile', { user });
});

router.post('/auth/register', async function (req, res) {
  const { name, username, email, password } = req.body;

  const userData = new userModel({
    name,
    username,
    email
  });

  userModel.register(userData, password).then(function (registeredUser) {
    passport.authenticate('local')(req, res, function () {
      res.redirect('/profile');
    })
  })
});

router.post('/auth/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), function (req, res) {
  
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  })
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
