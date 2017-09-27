const bcrypt  = require('bcrypt');
const co      = require('co');
const _       = require('lodash');
const crypto  = require('crypto');
const querystring = require('querystring');
const uuidv1 = require('uuid/v1');
const mailer  = require('../lib/mailer');
const rp      = require('request-promise');

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
  res.render('user/signupView')
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
    signupAccount = _.assign(_.pick(req.body, 'name', 'email', 'userType'), { password: hashedPwd });

    // validate account
    yield (new gModels.User(signupAccount)).validate();

    res.cookie('signupAccount', JSON.stringify(signupAccount), {
      domain: gConfig.site,
      secure: process.env.NODE_ENV === 'production',
      path: '/signup'
    });
    res.json({ error: 0, location: '/signup?step=2' });
  }).catch(function(error) {
    if (error.errors && (error.errors['name'] || error.errors['email'])) {
      error.errors = _.pick(error.errors, 'name', 'email');
      res.json({
        error: 1,
        errors: _.mapValues(error.errors, function(e) { return e.message; })
      });
    } else {
      // 临时保存用户账号信息供之后创建账户使用
      res.cookie('signupAccount', JSON.stringify(signupAccount), {
        domain: gConfig.site,
        secure: process.env.NODE_ENV === 'production',
        path: '/signup'
      });
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
    loginUser(res, user);
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
  let name = req.query.name;

  gModels.User.findOne({ name: name }).exec().then(function(u) {
    if (u) res.json({
      valid: false,
      message: name + ' 已经存在'
    });
    else res.json({
      valid: true
    });
  });
}

// 验证email的正确性
function isValidEmail(req, res, next) {
  let email = req.query.email;

  gModels.User.findOne({ email: email }).exec().then(function(u) {
    if (u) res.json({
      valid: false,
      message: email + ' 已经存在'
    });
    else res.json({
      valid: true
    });
  });
}

// 登录页面
function loginView(req, res, next) {
  res.locals.title = '实习网-用户登陆';
  res.render('user/loginView', {
    return_to: req.query.return_to || '/',
    flashErrors: req.flash('error')
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
      loginUser(res, user);
      res.json({ error: 0, location: req.body.return_to || '/' });
    } else {
      res.json({ error: 1, errors: { password: '密码错误' } });
    }
  });
}

// logout
function logoutHandler(req, res, next) {
  res.clearCookie('_ppinfo', {
    domain: gConfig.site, // 必须加domain才能清除掉
  });
  res.redirect('/');
}

// make user login
function loginUser(res, user) {
  res.cookie('_ppinfo', JSON.stringify({
    id:     user.id,
    name:   user.name,
    type:   user.userType,
    avatar: user.avatarUrl
  }), {
    // apply to mysite.com and all its subdomains
    // no way to match exactly 'mysite.com'
    // http://erik.io/blog/2014/03/04/definitive-guide-to-cookie-domains/
    domain: gConfig.site,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 3600 * 1000
  });
}

// 密码重置
function passwordReset(req, res, next) {
  if (req.method === 'GET') {
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

    if (newPassword !== newPasswordAgain) {
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
      user.password = yield new Promise(function(resolve) {
        bcrypt.hash(newPassword, 10, function(err, hash) {
          return resolve(hash);
        });
      });

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
        subject: '实习网密码重置',
        html:
          `<p>请在24小时之内点击下面的链接进入重置过程:</p>
          <p>
            <a href="http://${gConfig.site}/password_reset/${user.token}">
              http://${gConfig.site}/password_reset/${user.token}
            </a>
          </p>`
      })
    }

    res.render('user/passwordReset', { step: 2 });
  }).catch(next);
}

// search company by name
function queryByCompanyName(req, res, next) {
  let companyName = req.query.kw;

  if (companyName.trim() === '')
    return res.json({ error: 0, items: [] });

  gModels.User.find({
    userType: 1,
    name:     { $regex: companyName }
  }, 'name', { lean: true }, function(err, users) {
    res.json({ error: 0, items: users.map(u => u.name) });
  });
}

/**
 * 跳转到第三方登录授权页面
 * @param req
 * @param res
 */
function loginByAuth(req, res) {
  let oauthServer = req.params.oauthServer;
  let oauthCfg = gConfig.oauth[oauthServer];
  let state = uuidv1();

  let qs = Object.assign(_.pick(oauthCfg, [
    'client_id', 'redirect_uri', 'scope'
  ]), { state });

  req.session.oauthState = state;


  res.redirect(`${oauthCfg.authorize_uri}?${querystring.stringify(qs)}`);
}

/**
 * oauth服务器回调
 * @param req
 * @param res
 * @param next
 */
function oauthCallback(req, res, next) {
  let code = req.query.code;
  let state = req.query.state;
  let oauthServer = req.params.oauthServer;
  let oauthCfg = gConfig.oauth[oauthServer];

  if (state !== req.session.oauthState) {
    return next(new Error('无效oauth验证'));
  }

  let qs = Object.assign(_.pick(oauthCfg, [
    'client_id', 'client_secret', 'redirect_uri'
  ]), { code });

  if (oauthServer === 'github') {
    qs.state = state;
  } else if (oauthServer === 'qq') {
    qs.grant_type = 'authorization_code';
  }

  co(function *() {
    // 1. 获取access_token
    let accessToken = querystring.parse(rp({
      method: 'POST',
      uri: oauthCfg.token_uri,
      body: qs
    })).access_token;

    // 2. 获得用户在第三方的基本信息
    let user;

    if (oauthServer === 'qq') {
      let openid = rp({
        uri: oauthCfg.openid_uri,
        qs: { access_token: accessToken }
      }).match(/"openid":"(\w+)"/)[1];

      user = rq({
        uri: oauthCfg.user_uri,
        qs: {
          access_token: accessToken,
          oauth_consumer_key: oauthCfg.client_id,
          openid,
          format: 'json'
        }
      })

    } else {
      user = rp({
        uri: oauthCfg.user_uri,
        headers: {
          'Authorization': 'token ' + accessToken
        },
        json: true
      });
    }

    console.log(user);

    // 3. 将用户信息保存起来并让用户登录
    loginUser(res, user);
  }).catch(next);
}

exports = module.exports = {
  login:  loginHandler,
  logout: logoutHandler,
  signupView, signup_step1, signup_step2,
  loginView, isValidName, isValidEmail, loginUser,
  passwordReset, show, queryByCompanyName,
  loginByAuth, oauthCallback
};
