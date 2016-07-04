'use strict'

const User       = require('../models/user');
const Student    = require('../models/student');
const Enterprise = require('../models/enterprise');
const bcrypt     = require( 'bcrypt');

const VALID_EMAIL_REG = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/; 
const SALT_ROUNDS = 10;

function signupView(req, res, next) {
  res.locals.title = '学做-用户注册';
  res.render('user/signupView');
}

function signupHandler(req, res, next) {
  let email = req.body.email;
  let userType = req.body.userType;
  let password = req.body.password;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty'});
  }

  if (!VALID_EMAIL_REG.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email'});
  }

  bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
    let u = new User({ email: email, password: hash, userType: userType });

    u.save(function(err) {
      if (err) {
        return res.json({ error: 1, message: 'signup failed, please try again later'});
      }

      let m;
      if (userType == 'student') {
        m = new Student(req.body.student);
      } else {
        m = new Enterprise(req.body.ent);
      }

      m._userId = u.id;
      m.save(function(err) {
        res.json({ error: 0 });
      });
    });
  });
}

function loginView(req, res, next) {
  res.locals.title = '学做-用户登陆';
  res.render('user/loginView');
}

function loginHandler(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty'});
  }

  if (!VALID_EMAIL_REG.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email'});
  }

  User.findOne({ email }, function(err, user) {
    if (!user) {
      return res.json({ error: 1, message: 'user not exist' });
    }

    bcrypt.compare(password, user.password, function(err, match) {
      if (match) {
        req.session.email = email;
        req.session.userType = user.userType;
        return res.json({ error: 0, email, userType: user.userType });
      } else {
        return res.json({ error: 1, message: 'user and password not match' });
      }
    });
  })
}

// logout
function logoutHandler(req, res, next) {
  if (req.session.email) {
    req.session.email = null;
  }

  res.redirect('/');
}

exports = module.exports = {
  signupView: signupView,
  signup: signupHandler,
  loginView: loginView,
  login:  loginHandler,
  logout: logoutHandler
};
