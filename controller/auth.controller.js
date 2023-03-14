const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user.model')

const loginGet = (req, res, next) => {
    const user = res.locals.currentUser;
    const error = req.flash('error')[0];
    res.render('login', {
        user: user,
        error: error
    });
}

const loginPost = passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})

const signUpGet = (req, res, next) => {
    res.render('signup', { error: "" });
}

const signUpPost = [
    body('username').trim().isString()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 character'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 character')
        .custom((value, { req }) => {
            if (value !== (req.body.confirmPassword)) {
                throw new Error('Confirm password does not match');
            }
            return true;
        }),

    async (req, res, next) => {
        const result = validationResult(req);
        const existedUser = await User.findOne({ username: req.body.username });
        if (!result.isEmpty()) {
            res.render('signup', {
                user: null,
                error: result.errors[0].msg
            });
        } else if (existedUser) {
            //Check username existed
            res.render('signup', {
                user: null,
                error: 'Username already existed!'
            });
        } else {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    return next(err);
                } else {
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        if (err) {
                            return next(err);
                        } else {
                            const user = new User({ username: req.body.username, password: hash }).save()
                                .then(()=>{
                                    res.render('login', {
                                        user: null,
                                        error: ''
                                    });
                                }).catch((err)=>{
                                    console.log(err);
                            })
                        }
                    })
                }
            });
        }
    }
];

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.redirect('/login');
}

const isLogged = (req, res, next) => {
    if (req.user) {
        res.redirect('/');
    }
    return next();
}

const logOut = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
  });
}

const isMember = (req, res, next) => {
    if(req.user.member) {
        return next();
    }
    res.redirect('/login');
}

const isAdmin = (req, res, next) => {
    if(req.user.admin) {
        return next();
    }
    res.redirect('/login');
}

module.exports = {
    loginGet,
    loginPost,
    signUpGet,
    signUpPost,
    isLoggedIn,
    isLogged,
    logOut,
    isMember,
    isAdmin
}