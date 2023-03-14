require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signUpRouter = require('./routes/signup');
const logOutRouter = require('./routes/logout');
const memberRouter = require('./routes/member');
const adminRouter = require('./routes/admin');
const messagesRouter = require('./routes/messages');
const app = express();

//database connection
const mongoose = require('mongoose');
// mongoose.set('strictQuery', true);
const URI = process.env.URI;
mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Passport configure 
const User = require('./models/user.model');
const bcrypt = require('bcryptjs');
const { logOut } = require('./controller/auth.controller');

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username.trim() }, (err, user) => {
      if (err) return done(err)

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        }
        return done(null, false, { message: 'Incorrect password' });
      })
    })
  }));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
});

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signUpRouter);
app.use('/logout', logOutRouter);
app.use('/member', memberRouter);
app.use('/admin', adminRouter);
app.use('/messages', messagesRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect("/");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
