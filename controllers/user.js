'use strict'

const bcrypt = require('bcrypt');
const co     = require('co');

const validEmailFormat = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/; 

function signupView(req, res, next) {
  res.locals.title = '学做-用户注册';
  res.render('user/signupView');
}

/**
 * signup a user
 */
function signupHandler(req, res, next) {
  // format validation
  let name     = req.body.name;
  let email    = req.body.email;
  let password = req.body.password;
  let userType = req.body.user_type;

  if (!(name && email && password)) {
    return res.json({ error: 1, message: '用户名或邮箱或密码为空'});
  }

  if (!validEmailFormat.test(email)) {
    return res.json({ error: 1, message: '邮箱格式错误'});
  }

  // check if name or email is already used by others
  // if yes, return error
  // else create the user and give the next location to go
  co(function* () {
    let user = yield gModels.User.findOne().or([{ name: name}, {email: email }]).then();

    if (user) {
      return res.json({ error: 1, message: '用户名或邮箱已存在' });
    }

    let hashedPwd = yield new Promise(function(resolve) {
      bcrypt.hash(password, 10, function(err, hash) {
        return resolve(hash);
      });
    });

    user = yield gModels.User.create({
      name:     name,
      email:    email,
      password: hashedPwd,
      userType: userType
    });

    return { error: 0, location: '/login'};
  }).then(function(result) {
    res.json(result);
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

  if (!validEmailFormat.test(email)) {
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
