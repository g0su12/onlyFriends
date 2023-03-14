var express = require('express');
const { isLoggedIn } = require('../controller/auth.controller');
var router = express.Router();

const User = require('../models/user.model')

router.get('/verify', isLoggedIn, (req, res, next) => {
    res.render('admin', {
        user: res.locals.currentUser,
        error: ""
    });
});

router.post('/verify', isLoggedIn, (req, res, next) => {
    if (req.body.adminPassword != process.env.adminPw) {
        res.render('admin', {
            user: res.locals.currentUser,
            error: 'Wrong password'
        });
    } else {
        const userId = res.locals.currentUser._id; //get iD of current user
        User.findOneAndUpdate({_id: userId}, {$set: {"admin" : true}}, {}, (err, updatedUser) => {
            if(err) return next(err);
            res.redirect('/messages');
        })
    }
});

router.get('/dashboard', isLoggedIn, (req, res, next) => {
    res.render('dashboard', {
        user: res.locals.currentUser
    });
});

module.exports = router;

