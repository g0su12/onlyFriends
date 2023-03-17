const express = require('express');

const { asAdmin, asMember, isLoggedIn } = require('../controller/auth.controller');

const router = express.Router();

const User = require('../models/user.model');

router.get('/', isLoggedIn, (_req, res) => {
  res.render('verify', {
    user: res.locals.currentUser,
    error: '',
  });
});

router.get('/admin', asAdmin, (req, res) => {
  res.render('admin', {
    user: res.locals.currentUser,
    error: '',
  });
});

router.post('/admin', (req, res, next) => {
  if (req.body.adminPassword !== process.env.adminPw) {
    res.render('admin', {
      user: res.locals.currentUser,
      error: 'Wrong password',
    });
  } else {
    // eslint-disable-next-line no-underscore-dangle
    const userId = res.locals.currentUser._id;
    User.findOneAndUpdate({ _id: userId }, { $set: { admin: true } }, {}, (err, _updatedUser) => {
      if (err) return next(err);
      res.redirect('/messages');
    });
  }
});

router.get('/member', asMember, (_req, res) => {
  res.render('member', {
    user: res.locals.currentUser,
    error: '',
  });
});

router.post('/member', (req, res, next) => {
  if (req.body.memberPassword !== process.env.memberPw) {
    res.render('member', {
      user: res.locals.currentUser,
      error: 'Wrong password',
    });
  } else {
    // eslint-disable-next-line no-underscore-dangle
    const userId = res.locals.currentUser._id; 
    User.findOneAndUpdate({ _id: userId }, { $set: { member: true } }, {}, (err, updatedUser) => {
      if (err) return next(err);
      res.redirect('/messages');
    });
  }
});

module.exports = router;
