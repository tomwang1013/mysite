'use strict'

const session    = require('express-session');
const mongoose   = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// check if loged in
function checkLogin(req, res, next) {
  if (!req.currentUser) {
    var loginUrl = '/login?return_to=' + (req.get('Referer') || '/');

    req.flash('error', '请先登录：');

    if (req.xhr) {
      return res.json({ error: 1, location: loginUrl });
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

    req.flash('error', '请先登录：');

    if (req.xhr) {
      return res.json({ error: 1, location: loginUrl });
    } else {
      return res.redirect(loginUrl);
    }
  } else if (req.currentUser.type !== 1) {
    req.flash('error', '请先以公司身份登录：');

    if (req.xhr) {
      return res.json({ error: 1 });
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

    req.flash('error', '请先登录：');

    if (req.xhr) {
      return res.json({ error: 1, location: loginUrl });
    } else {
      return res.redirect(loginUrl);
    }
  } else if (req.currentUser.type !== 0) {
    req.flash('error', '请先以学生身份登录：');

    if (req.xhr) {
      return res.json({ error: 1 });
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

// session data stored in mongodb:
// db.sessions.findOne():
// {
//  "_id" : "QHcGyHwjvNKjQUlSyhQS3RUk1rHT06gC",
//  "session" : "{
//    \"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},
//    \"currentUser\":{\"id\":\"58181b41b2450e5e559fdaca\",\"name\":\"wjg\",\"type\":0,\"avatar\":\"/uploads/Lighthouse-1481173852098-400x400.jpg\"},
//    \"flash\":{}
//  }",
//  "expires" : ISODate("2016-12-23T04:43:41.115Z")
// }
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
