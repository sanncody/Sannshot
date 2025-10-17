const express = require('express');
const userModel = require('../models/userModel');
const passport = require('passport');
const router = express.Router();
const localStrategy = require('passport-local');
const upload = require('../config/multer');
const postModel = require('../models/postModel');

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { nav: false });
});

router.get('/register', function (req, res) {
  res.render('register', { nav: false });
});

router.get('/profile', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ _id: req.session.passport.user });
  await user.populate('posts');

  res.render('profile', { user, nav: true });
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

router.get('/add', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ _id: req.session.passport.user });

  res.render('add', { user, nav: true });
});

router.post('/post/create', isLoggedIn, upload.single('postImage'), async function (req, res) {
  const { title, description } = req.body;

  const user = await userModel.findOne({ _id: req.session.passport.user });

  const createdPost = await postModel.create({
    title,
    description,
    postImg: req.file.filename,
    user: user._id
  });

  user.posts.push(createdPost._id);
  await user.save();

  res.redirect('/profile');
});

router.post('/profile/upload', isLoggedIn, upload.single('image'), async function (req, res) {
  if (!req.file) {
    return res.status(400).send('No file is uploaded');
  }

  const user = await userModel.findOne({ _id: req.session.passport.user });

  user.profileImage = req.file.filename
  await user.save();

  res.redirect('/profile');
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
