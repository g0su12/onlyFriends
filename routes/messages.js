/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const { isLoggedIn } = require('../controller/auth.controller');
const Message = require('../models/message.model');

// Handle message post
router.post('/post-message', isLoggedIn, (req, res, next) => {
  Message.create({
    user: req.user._id,
    title: req.body.messageTitle,
    message: req.body.messageContent,
  }, (err, newMessage) => {
    if (err) {
      return next(err);
    }
    res.redirect('/messages/page');
  });
});

router.get('/page/:page?', isLoggedIn, (req, res, next) => {
  try {
    // Get 5 posts per page
    const perPage = 5;
    const page = req.params.page || 1;

    Message.find()
      .sort({ post_date: 'descending' })
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .populate('user')
      .exec((err, messages) => {
        if (err) return next(err);
        // Count the messages
        Message.countDocuments((err, count) => {
          if (err) return next(err);
          res.render('messages', {
            user: res.locals.currentUser,
            messages,
            currentPage: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
