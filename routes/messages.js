var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../controller/auth.controller');
const Message = require('../models/message.model');

router.get('/', isLoggedIn, (req, res, next) => {
    const user = res.locals.currentUser;
    res.render('messages', {
        user: user
    });
})

module.exports = router; 