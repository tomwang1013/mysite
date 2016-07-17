'use strict'

const session    = require('express-session');
const mongoose   = require('mongoose');
const MongoStore = require('connect-mongo')(session);

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
  if (req.session && req.session.userName) {
    req.currentUser = {
      id:   req.session.userId,
      name: req.session.userName,
      type: req.session.userType
    };
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
  getReq:      getReq,
  session:     sessionHandler,
  currentUser: currentUser
};
