const express = require('express');

const { isAdmin } = require('../controller/auth.controller');

const router = express.Router();

const User = require('../models/user.model');

const Message = require('../models/message.model');

router.get('/dashboard/users', isAdmin, async (req, res) => {
  const users = await User.find();
  res.render('dashboard', {
    user: res.locals.currentUser,
    users,
  });
});

router.get('/dashboard/messages', isAdmin, (req, res, next) => {
  try {
    const messages = Message.find()
      .sort({ post_date: 'descending' })
      .populate('user')
      .exec((err, messages) => {
        if (err) return next(err);
        res.render('dashboard-msg', {
          user: req.user,
          messages,
        });
      });
  } catch (err) {
    console.error(err);
  }
});

router.post('/dashboard/users/delete-user', isAdmin, (req, res, next) => {
  try {
    User.findOneAndDelete({ _id: req.body.userIdDelete }, (err) => {
      if (err) return next(err);
      Message.deleteMany({ user: req.body.userIdDelete }, (err) => {
        if (err) return next(err);
      });
    });
    res.redirect('/admin/dashboard/users');
  } catch (err) {
    console.error(err);
  }
});

router.post('/dashboard/messages/delete-msg', isAdmin, async (req, res, next) => {
  try {
    // Delete post
    await Message.findOneAndDelete({ _id: req.body.msgIdDelete }, (err) => {
      if (err) return next(err);
      res.redirect('/admin/dashboard/messages');
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
