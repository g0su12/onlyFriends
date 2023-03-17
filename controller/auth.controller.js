/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user.model');

const loginGet = (req, res) => {
  const user = res.locals.currentUser;
  const error = req.flash('error')[0];
  res.render('login', {
    user,
    error,
  });
};

const loginPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
});

const signUpGet = (req, res) => {
  res.render('signup', { error: '' });
};

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
        error: result.errors[0].msg,
      });
    } else if (existedUser) {
      // Check username existed
      res.render('signup', {
        user: null,
        error: 'Username already existed!',
      });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err);
        }
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return next(err);
          }
          // eslint-disable-next-line no-unused-vars
          const user = new User({ username: req.body.username, password: hash }).save()
            .then(() => {
              res.render('login', {
                user: null,
                error: '',
              });
            }).catch(() => {
              console.log(err);
            });
        });
      });
    }
  },
];

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/login');
};

const isLogged = (req, res, next) => {
  if (req.user) {
    res.redirect('/');
  }
  return next();
};

const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

const isMember = (req, res, next) => {
  if (req.user.member) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.user.admin) {
    return next();
  }
  res.redirect('/login');
};

const asAdmin = (req, res, next) => {
  if (req.user.admin) {
    res.redirect('/');
  }
  return next();
};

const asMember = (req, res, next) => {
  if (req.user.member) {
    res.redirect('/');
  }
  return next();
};

module.exports = {
  loginGet,
  loginPost,
  signUpGet,
  signUpPost,
  isLoggedIn,
  isLogged,
  logOut,
  isMember,
  isAdmin,
  asAdmin,
  asMember,
};
