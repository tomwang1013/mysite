'use strict'

const bcrypt  = require('bcrypt');
const co      = require('co');
const _       = require('lodash');
const crypto  = require('crypto');
const mailer  = require('../lib/mailer');

// 用户详情页: 暂时没有权限限制
function show(req, res, next) {
  gModels.User.findById(req.params.id, function(err, user) {
    if (err) return next(err);

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

// 用户注册页面
function signupView(req, res, next) {
  let step = req.query.step ? parseInt(req.query.step) : 1;

  if (step == 2) {
    gModels.Major.all().then(function(result) {
      res.render('user/signupView', {
        step:         step,
        title:        '学做-用户注册',
        userType:     req.session.signupAccount.userType,
        majors:       result,
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
 * signup a user:
 * check account info and save it for later creation
 */
function signup_step1(req, res, next) {
  let signupAccount;

  co(function* () {
    let hashedPwd = yield new Promise(function(resolve) {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        return resolve(hash);
      });
    });
    signupAccount = _.assign(_.pick(req.body, 'name', 'email', 'userType'),
                             { password: hashedPwd });
    yield (new gModels.User(signupAccount)).validate();
    res.json({ error: 0, location: '/signup?step=2' });
  }).catch(function(error) {
    if (error && (error.errors['name'] || error.errors['email'])) {
      error.errors = _.pick(error.errors, 'name', 'email');
      res.json({
        error: 1,
        errors: _.mapValues(error.errors, function(e) { return e.message; })
      });
    } else {
      // 临时保存用户账号信息供之后创建账户使用
      req.session.signupAccount = signupAccount;
      res.json({ error: 0, location: '/signup?step=2' });
    }
  });
}

/**
 * signup a user:
 * create user
 */
function signup_step2(req, res, next) {
  co(function* () {
    // 将账号信息和其他信息一起创建账号
    let userFullAttrs = _.assign(req.body, req.session.signupAccount);
    let user = yield gModels.User.create(userFullAttrs);
    loginUser(req, user);
    res.json({ error: 0, location: '/signup?step=3' });
  }).catch(function(error) {
    res.json({
      error: 1,
      errors: _.mapValues(error.errors, function(e) { return e.message; })
    });
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

// 登录页面
function loginView(req, res, next) {
  res.locals.title = '学做-用户登陆';
  res.render('user/loginView', {
    return_to: req.query.return_to || '/'
  });
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
      res.json({ error: 0, location: req.body.return_to || '/' });
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
    id:     user.id,
    name:   user.name,
    type:   user.userType,
    avatar: user.avatarUrl()
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

// search company by name
function queryByCompanyName(req, res, next) {
  let companyName = req.query.kw;

  gModels.find({
    userType: 1,
    name:     companyName
  }, 'name', { lean: true }, function(err, users) {
    res.json({ error: 0, items: users.map(u => u.name) });
  });
}

exports = module.exports = {
  login:  loginHandler,
  logout: logoutHandler,
  signupView, signup_step1, signup_step2,
  loginView, isValidName, isValidEmail,
  passwordReset, show, queryByCompanyName
};
