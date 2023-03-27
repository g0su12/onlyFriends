const express = require('express');
const { isLoggedIn, changePwPost } = require('../controller/auth.controller');

const router = express.Router();
const User = require('../models/user.model');

const Message = require('../models/message.model');

router.get('/profile/:id', isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });

    const postNumber = await Message.count({ user: userId });

    const reactNum = await Message.find({ user: userId }, 'reactions -_id');
    console.log(postNumber);
    res.render('profile', {
      user,
      postNumber,
      reactionQuantity: reactNum.reduce((acc, cur) => acc + cur.reaction_count, 0),
    });
  } catch (err) {
    console.error(err);
  }
});

router.get('/change-password', isLoggedIn, (req, res, next) => {
  res.render('change-pw', {
    user: res.locals.currentUser,
    error: '',
  });
});
router.post('/change-password', isLoggedIn, changePwPost);

module.exports = router;
