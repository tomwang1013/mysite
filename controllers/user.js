'use strict'

const bcrypt  = require('bcrypt');
const co      = require('co');
const _       = require('lodash');
const crypto  = require('crypto');
const mailer  = require('../lib/mailer');

function show(req, res, next) {
  gModels.User.findById(req.params.id, function(err, user) {
    if (err) return next(err);

    console.log(user);
    if (req.currentUser.type == user.userType && req.currentUser.id != user.id) {
      res.redirect('/');
      return;
    }

    if (user.isCompany()) {
      gModels.Job.find({ _creator: user.id }, function(err, ret) {
        res.render('user/show', {
          user: user,
          jobs: ret
        });
      })
    } else {
      res.render('user/show', { user: user });
    }
  });
}

function signupView(req, res, next) {
  let step = req.query.step ? parseInt(req.query.step) : 1;

  if (step == 2) {
    Promise.all([
      gModels.University.all(),
      gModels.Major.all()
    ]).then(function(result) {
      res.render('user/signupView', {
        step:         step,
        title:        '学做-用户注册',
        userType:     req.currentUser ? req.currentUser.type : undefined,
        universities: result[0],
        majors:       result[1],
        entryDates:   gModels.User.allEntryDates,
        businesses:   gModels.Business,
        scales:       gModels.User.scales,
        maturities:   gModels.User.maturities
      });
    })
  } else {
    res.render('user/signupView', {
      step:       step,
      title:      '学做-用户注册',
      userType:   req.currentUser ? req.currentUser.type : undefined
    });
  }
}

/**
 * signup a user
 */
function signupHandler(req, res, next) {
  let curStep = parseInt(req.body.step);
  let nextStep = curStep + 1;
  let user;

  co(function* () {
    switch(curStep) {
      case 1:
        // create account
        let hashedPwd = yield new Promise(function(resolve) {
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            return resolve(hash);
          });
        });

        let attrs = _.pick(req.body, ['name', 'email', 'userType']);
        user = yield gModels.User.create(_.assign(attrs, { password: hashedPwd }));
        loginUser(req, user);
        break;

      case 2:
        // add other info
        user = yield gModels.User.findById(req.currentUser.id).exec();
        let attrsToUpdate;

        if (user.isStudent()) {
          attrsToUpdate = ['university', 'major', 'entryDate', 'careerPlan', 'zuopin'];
        } else {
          attrsToUpdate = ['url', 'business', 'scale', 'maturity', 'desc']
        }

        user = yield _.assign(user, _.pick(req.body, attrsToUpdate)).save();
        break;

      case 3:
        // never be here: signup over
        break;

      default:
        break;
    }

    res.json({ error: 0, location: '/signup?step=' + nextStep });
  }).catch(function(err) {
    if (err.errors) {
      res.json({ error: 1, errors: _.mapValues(err.errors, function(e) { return e.message; }) });
    } else {
      res.json({ error: 1, message: err.message });
    }
  });
}

// 验证用户名的正确性
function isValidName(req, res, next) {
  var name = req.query.name;

  gModels.User.findOne({ name: name }).exec().then(function(u) {
    if (u) res.json(name + ' 已经存在');
    else res.json('true');
  });
}

// 验证email的正确性
function isValidEmail(req, res, next) {
  var email = req.query.email;

  gModels.User.findOne({ email: email }).exec().then(function(u) {
    if (u) res.json(email + ' 已经存在');
    else res.json('true');
  });
}

function loginView(req, res, next) {
  res.locals.title = '学做-用户登陆';
  res.render('user/loginView');
}

function loginHandler(req, res, next) {
  let email    = req.body.email;
  let password = req.body.password;

  co(function* () {
    let user = yield gModels.User.findOne({ email: email }).exec();

    if (!user) {
      return res.json({ error: 1, errors: { email: '该用户不存在' } });
    }

    let match = yield new Promise(function(resolve, reject) {
      bcrypt.compare(password, user.password, function(err, match) {
        return resolve(match);
      });
    });

    if (match) {
      loginUser(req, user);
      res.json({ error: 0, location: req.query.return_to || '/' });
    } else {
      res.json({ error: 1, errors: { password: '密码错误' } });
    }
  });
}

// logout
function logoutHandler(req, res, next) {
  req.session.destroy(function(err) {
    res.redirect('/login');
  });
}

// make user login
function loginUser(req, user) {
  req.session.currentUser = {
    id:   user.id,
    name: user.name,
    type: user.userType
  };
}

// 密码重置
function passwordReset(req, res, next) {
  if (req.method == 'GET') {
    if (req.params.token) {
      // step 3: user come here from reset email link
      return co(function* () {
        let user = yield gModels.User.findOne({
          token:    req.params.token,
          tokenExp: { $gt: new Date() }
        }).exec();

        if (!user) throw new Error('无效密码重置链接');

        res.render('user/passwordReset', {
          step:  3,
          token: req.params.token
        });
      }).catch(next);
    }

    // step 1: get email
    return res.render('user/passwordReset', {
      email: req.currentUser ? req.currentUser.email : '',
      step: 1
    });
  }

  if (req.params.token) {
    // step 4: change password
    let newPassword = req.body.new_password;
    let newPasswordAgain = req.body.new_password_again;

    if (newPassword != newPasswordAgain) {
      return res.render('user/passwordReset', {
        step:  3,
        token: req.params.token,
        error: '确认密码错误'
      });
    }

    return co(function* () {
      let user = yield gModels.User.findOne({
        token:    req.params.token
      }).exec();

      // set new password
      let newHashedPwd = yield new Promise(function(resolve) {
        bcrypt.hash(newPassword, 10, function(err, hash) {
          return resolve(hash);
        });
      });

      user.password = newHashedPwd;

      yield user.save();

      res.render('user/passwordReset', { step: 4 });
    });
  }

  // step 2: send a mail and tell user to see it
  co(function* () {
    let user = yield gModels.User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.render('user/passwordReset', {
        error:  '该邮箱未注册',
        step:   1
      });
    }

    user.token    = crypto.randomBytes(64).toString('hex');
    user.tokenExp = new Date(Date.now() + 24 * 60 * 60 * 1000);

    yield {
      userSave:     user.save(),
      sendEmailRes: mailer.sendMail({
        from:     gConfig.nodemailer.auth.user,
        to:       req.body.email,
        subject: '学做网密码重置',
        html:
          `<p>请在24小时之内点击下面的链接进入重置过程:</p>
          <p>
            <a href="http://192.168.1.7:3000/password_reset/${user.token}">
              http://192.168.1.7:3000/password_reset/${user.token}
            </a>
          </p>
          `
      })
    }

    res.render('user/passwordReset', { step: 2 });
  }).catch(next);
}

exports = module.exports = {
  signupView:     signupView,
  signup:         signupHandler,
  loginView:      loginView,
  login:          loginHandler,
  logout:         logoutHandler,
  isValidName:    isValidName,
  isValidEmail:   isValidEmail,
  passwordReset:  passwordReset,
  show:           show
};
