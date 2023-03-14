var express = require('express');
const { isLoggedIn } = require('../controller/auth.controller');
var router = express.Router();

const User = require('../models/user.model')

router.get('/verify', isLoggedIn, (req, res, next) => {
    res.render('member', {
        user: res.locals.currentUser,
        error: ""
    });
});

router.post('/verify', isLoggedIn, (req, res, next) => {
    if (req.body.memberPassword != process.env.memberPw) {
        res.render('member', {
            user: res.locals.currentUser,
            error: 'Wrong password'
        });
    } else {
        const userId = res.locals.currentUser._id; //get iD of current user
        User.findOneAndUpdate({_id: userId}, {$set: {"member" : true}}, {}, (err, updatedUser) => {
            if(err) return next(err);
            res.redirect('/messages');
        })
    }
});

module.exports = router;
