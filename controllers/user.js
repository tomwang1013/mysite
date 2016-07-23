'use strict'

const bcrypt = require('bcrypt');
const co     = require('co');
const _      = require('lodash');

function signupView(req, res, next) {
  res.locals.title = '学做-用户注册';
  res.render('user/signupView');
}

/**
 * signup a user
 */
function signupHandler(req, res, next) {
  // format validation
  let userType = req.body.user_type;

  co(function* () {
    let hashedPwd = yield new Promise(function(resolve) {
      bcrypt.hash(password, 10, function(err, hash) {
        return resolve(hash);
      });
    });

    let attrs = _.pick(req.body, ['name', 'email', 'phone', 'userType',
                       'university', 'major', 'entryDate', 'url', 'desc']);

    user = yield gModels.User.create(_.assign(attrs, { password: hashedPwd }));

    res.json({ error: 0, location: '/login'});
  });
}

function loginView(req, res, next) {
  res.locals.title = '学做-用户登陆';
  res.render('user/loginView');
}

function loginHandler(req, res, next) {
  let name = req.body.name;
  let password = req.body.password;

  if (!name || !password) {
    return res.json({ error: 1, message: '用户或密码为空'});
  }

  co(function* () {
    let user = yield gModels.User.findOne().
      or([{ name: name }, { email: name }]).then();

    if (!user) {
      return res.json({ error: 1, message: '用户名或密码错误' });
    }

    let match = yield new Promise(function(resolve, reject) {
      bcrypt.compare(password, user.password, function(err, match) {
        return resolve(match);
      });
    });

    if (match) {
      req.session.userId   = user.id;
      req.session.userName = user.name;
      req.session.userType = user.userType;

      if (user.isStudent()) {
        res.json({ error: 0, location: '/jobs' });
      } else {
        res.json({ error: 0, location: '/jobs/new' });
      }
    } else {
      res.json({ error: 1, message: '用户名或密码错误' });
    }
  });
}

// logout
function logoutHandler(req, res, next) {
  req.session.destroy(function(err) {
    res.redirect('/');
  });
}

exports = module.exports = {
  signupView: signupView,
  signup:     signupHandler,
  loginView:  loginView,
  login:      loginHandler,
  logout:     logoutHandler,
};
