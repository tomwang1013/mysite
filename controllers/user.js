'use strict'

const bcrypt = require('bcrypt');
const co     = require('co');
const _      = require('lodash');

function signupView(req, res, next) {
  let step = req.query.step ? parseInt(req.query.step) : 1;

  if (step == 2) {
    // university info
    let universities = {
      labels: ['省份', '学校名称'],
      data:   {}
    };

    // major info
    let majors = {
      labels: ['层次', '类别', '专业名称'],
      data:   { '本科': {}, '专科': {} }
    };

    let sp = gModels.University.find().batchSize(200).select('name province').exec();
    let tp = gModels.Major.find().batchSize(200).exec();

    Promise.all([sp, tp]).then(function(result) {
      result[0].forEach(function(school) {
        if (!universities.data[school.province]) {
          universities.data[school.province] = [];
        }

        universities.data[school.province].push(school.name);
      });



      result[1].forEach(function(major) {
        if (!majors.data[major.eduRank][major.type]) {
          majors.data[major.eduRank][major.type] = [];
        }

        majors.data[major.eduRank][major.type].push(major.name);
      });

      res.render('user/signupView', {
        step:         step,
        title:        '学做-用户注册',
        userType:     req.currentUser ? req.currentUser.type : undefined,
        universities: universities,
        majors:       majors
      });
    })
  } else {
    res.render('user/signupView', {
      step:     step,
      title:    '学做-用户注册',
      userType: req.currentUser ? req.currentUser.type : undefined
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
      return res.json({ error: 1, message: '该用户不存在' });
    }

    let match = yield new Promise(function(resolve, reject) {
      bcrypt.compare(password, user.password, function(err, match) {
        return resolve(match);
      });
    });

    if (match) {
      loginUser(req, user);

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

// make user login
function loginUser(req, user) {
  req.session.currentUser = {
    id:   user.id,
    name: user.name,
    type: user.userType
  };
}

exports = module.exports = {
  signupView: signupView,
  signup:     signupHandler,
  loginView:  loginView,
  login:      loginHandler,
  logout:     logoutHandler,
  isValidName:  isValidName,
  isValidEmail: isValidEmail,
};
