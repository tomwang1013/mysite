'use strict'

const session    = require('express-session');
const mongoose   = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// check if loged in
function checkLogin(req, res, next) {
  if (!req.currentUser) {
    var loginUrl = '/login?return_to=' + (req.get('Referer') || '/');

    if (req.xhr) {
      return res.json({ error: 1, message: 'not login', location: loginUrl });
    } else {
      return res.redirect(loginUrl);
    }
  } else {
    next();
  }
}

// check if loged in and user is company
function checkCompanyLogin(req, res, next) {
  if (!req.currentUser) {
    var loginUrl = '/login?return_to=' + (req.get('Referer') || '/');

    if (req.xhr) {
      return res.json({ error: 1, message: 'not login', location: loginUrl });
    } else {
      return res.redirect(loginUrl);
    }
  } else if (req.currentUser.type !== 1) {
    if (req.xhr) {
      return res.json({ error: 1, message: 'please login as a company' });
    } else {
      return res.redirect('/');
    }
  } else {
    next();
  }
}

// check if loged in and user is company
function checkStudentLogin(req, res, next) {
  if (!req.currentUser) {
    var loginUrl = '/login?return_to=' + (req.get('Referer') || '/');

    if (req.xhr) {
      return res.json({ error: 1, message: 'not login', location: loginUrl });
    } else {
      return res.redirect(loginUrl);
    }
  } else if (req.currentUser.type !== 0) {
    if (req.xhr) {
      return res.json({ error: 1, message: 'please login as a student' });
    } else {
      return res.redirect('/');
    }
  } else {
    next();
  }
}

/**
 * get the current user if login
 */
function currentUser(req, res, next) {   
  if (req.session && req.session.currentUser) {
    req.currentUser = req.session.currentUser;
    res.locals.currentUser = req.session.currentUser;
  }

  next();
}

let sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
});

let sessionHandler = session({
  secret:            'xiongwang',
  resave:            false,
  saveUninitialized: false,
  store:             sessionStore
})

exports = module.exports = {
  session:            sessionHandler,
  currentUser:        currentUser,
  checkLogin:         checkLogin,
  checkCompanyLogin:  checkCompanyLogin,
  checkStudentLogin:  checkStudentLogin
};
