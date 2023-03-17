const express = require('express');

const { isAdmin } = require('../controller/auth.controller');

const router = express.Router();

const User = require('../models/user.model');

const Message = require('../models/message.model');

router.get('/dashboard/users', isAdmin, async (req, res) => {
  const Users = await User.find();
  res.render('dashboard', {
    user: res.locals.currentUser,
    Users,
  });
});

router.get('/dashboard/messages', isAdmin, async (req, res) => {
  const Messages = []; // test
  res.render('dashboard-msg', {
    user: res.locals.currentUser,
    Messages,
  });
});

module.exports = router;
