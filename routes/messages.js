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

    const messages = Message.find()
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
            currentUser: res.locals.currentUser,
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

router.post('/add-reaction', async (req, res, next) => {
  try {
    await Message.findOne({ _id: req.body.msgID })
      .populate('reactions')
      .exec((err, msg) => {
        if (err) return next(err);

        if (!msg.reactions.some((user) => user._id.equals(req.user._id))) {
          Message.findOneAndUpdate(
            { _id: req.body.msgID },
            { $push: { reactions: req.user } },
          ).exec((err, newMsg) => {
            if (err) return next(err);
            res.status(200).send(newMsg);
          });
        } else {
          res.status(400).send(msg);
        }
      });
  } catch (err) {
    console.error(err);
  }
});

router.post('/remove-reaction', async (req, res, next) => {
  try {
    await Message.findOne({ _id: req.body.msgID })
      .populate('reactions')
      .exec((err, msg) => {
        if (err) return next(err);

        if (msg.reactions.some((user) => user._id.equals(req.user._id))) {
          Message.findOneAndUpdate(
            { _id: req.body.msgID },
            { $pull: { reactions: req.user._id } },
            { multi: true },
          ).exec((err, newMsg) => {
            if (err) return next(err);
            res.status(200).send(newMsg);
          });
        } else {
          res.status(200).send(msg);
        }
      });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
