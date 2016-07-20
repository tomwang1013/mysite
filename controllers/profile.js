const mongoose = require('mongoose');

function index(req, res, next) {
  if (!req.currentUser) {
    res.redirect('/login');
  } else {
    res.redirect(301, '/profile/user_info');
  }
}

function userInfo(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  gModels.User.findOne({
    _id: new mongoose.Types.ObjectId(req.currentUser.id)
  }).exec(function(err, user) {
    res.render('profile/index', {
      pos:  'user_info',
      user: user
    });
  });
}

function jobs(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  gModels
    .ApplyJob.find({ _userId: req.currentUser.id })
    .populate('_job')
    .exec(function(err, applyJobs) {
    res.render('profile/index', {
      pos: 'jobs',
      jobs: applyJobs.map(function(a) { return a._job; }),
      user: req.currentUser
    });
  });
}

function changeUserInfo(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  var update = {};

  update[req.body.attrName] = req.body.value;

  gModels.User.findOneAndUpdate({
    _id: new mongoose.Types.ObjectId(req.currentUser.id)
  }, update, function(err, user) {
    if (err) {
      res.json({ error: 1, message: err.message });
    } else {
      res.json({ error: 0 });
    }
  });
}

exports = module.exports = {
  index:    index,
  userInfo: userInfo,
  jobs:     jobs,
  changeUserInfo: changeUserInfo,
};
