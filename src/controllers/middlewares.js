'use strict'

const session    = require( 'express-session');
const mongoose   = require( 'mongoose');
const MongoStore = require('connect-mongo')(session);

/**
 * get the current user if login
 */
function currentUser(req, res, next) {   
  if (req.session && req.session.email) {
    req.currentUser = { email: req.session.email, userType: req.session.userType };
  }

  next();
}

let sessionStore   = new MongoStore({
  mongooseConnection: mongoose.connection
});

let sessionHandler = session({
  secret:            'xiongwang',
  resave:            false,
  saveUninitialized: false,
  store:             sessionStore
})

exports = module.exports = {
  session:     sessionHandler,
  currentUser: currentUser
};
