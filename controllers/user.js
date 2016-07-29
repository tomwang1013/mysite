'use strict'

const bcrypt = require('bcrypt');
const co     = require('co');
const _      = require('lodash');

function signupView(req, res, next) {
  let step = req.query.step ? parseInt(req.query.step) : 1;
  let userType = req.session.signupUserType ? parseInt(req.session.signupUserType) : -1;
  res.locals.title = '学做-用户注册';
  res.render('user/signupView', { step: step, userType: userType });
}

/**
 * signup a user
 */
function signupHandler(req, res, next) {
  let curStep = parseInt(req.body.step);
  let nextStep = curStep + 1;

  co(function* () {
    switch(curStep) {
      case 1:
        let hashedPwd = yield new Promise(function(resolve) {
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            return resolve(hash);
          });
        });

        let attrs = _.pick(req.body, ['name', 'email', 'userType']);
        let user = yield gModels.User.create(_.assign(attrs, { password: hashedPwd }));
        req.session.signupUserId = user.id;
        req.session.signupUserType = user.userType;
        break;
      case 2:
        break;
      case 3:
        break;
      default:
        break;
    }

    if (nextStep > 3) {
      res.json({ error: 0, location: '/login'});
    } else {
      res.json({ error: 0, location: '/signup?step=' + nextStep });
    }
  }).catch(function(err) {
    if (err.errors) {
      res.json({ error: 1, errors: _.mapValues(err.errors, function(e) { return e.message; }) });
    } else {
      res.json({ error: 1, message: err.message });
    }
  });
}

function loginView(req, res, next) {
  res.locals.title = '学做-用户登陆';
  res.render('user/loginView');
}

function loginHandler(req, res, next) {
  let name     = req.body.name;
  let password = req.body.password;

  co(function* () {
    let user = yield gModels.User.findOne().
      or([{ name: name }, { email: name }]).exec();

    if (!user) {
      return res.json({ error: 1, message: '该用户不存在' });
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
      res.json({ error: 1, message: '密码错误' });
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
