'use strict'

const session    = require('express-session');
const mongoose   = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// check if loged in
function checkLogin(req, res, next) {
  if (!req.currentUser) {
    if (req.xhr) {
      return res.json({ error: 1, message: 'not login' });
    } else {
      return res.redirect('/login?return_to=' + (req.get('Referer') || '/'));
    }
  } else {
    next();
  }
}

// check if loged in and user is company
function checkCompanyLogin(req, res, next) {
  if (!req.currentUser) {
    if (req.xhr) {
      return res.json({ error: 1, message: 'not login' });
    } else {
      return res.redirect('/login?return_to=' + (req.get('Referer') || '/'));
    }
  } else if (req.currentUser.type !== 1) {
    if (req.xhr) {
      return res.json({ error: 1, message: 'please login as a company' });
    } else {
      return res.redirect('/login?return_to=' + (req.get('Referer') || '/'));
    }
  } else {
    next();
  }
}

// check if loged in and user is company
function checkStudentLogin(req, res, next) {
  if (!req.currentUser) {
    if (req.xhr) {
      return res.json({ error: 1, message: 'not login' });
    } else {
      return res.redirect('/login?return_to=' + (req.get('Referer') || '/'));
    }
  } else if (req.currentUser.type !== 0) {
    if (req.xhr) {
      return res.json({ error: 1, message: 'please login as a student' });
    } else {
      return res.redirect('/login?return_to=' + (req.get('Referer') || '/'));
    }
  } else {
    next();
  }
}

// store req to use in view
function getReq(req, res, next) {   
  res.locals.req = req;
  res.locals.res = res;
  next();
}

/**
 * get the current user if login
 */
function currentUser(req, res, next) {   
  if (req.session && req.session.currentUser) {
    req.currentUser = req.session.currentUser;
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
  getReq:             getReq,
  session:            sessionHandler,
  currentUser:        currentUser,
  checkLogin:         checkLogin,
  checkCompanyLogin:  checkCompanyLogin,
  checkStudentLogin:  checkStudentLogin
};
