'use strict'

const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');

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

  Promise.all([
    gModels.User.findOne({ _id: req.currentUser.id }).exec(),
    gModels.University.all(),
    gModels.Major.all()
  ]).then(function(result) {
    res.render('profile/index', {
      pos:          'user_info',
      universities: result[1],
      majors:       result[2],
      entryDates:   gModels.User.allEntryDates,
      businesses:   gModels.Business,
      scales:       gModels.User.scales,
      user:         result[0]
    });
  }).catch(function(err) {
    next(err);
  });
}

function jobs(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  co(function* () {
    let user = yield gModels.User.findOne({ _id: req.currentUser.id }).exec();
    let jobs;

    if (user.isStudent()) {
      let appliedJobs = yield gModels.ApplyJob.find({ _userId: user.id }).populate('_job').exec();
      jobs = appliedJobs.map(function(a) { return a._job; });
    } else {
      jobs = yield gModels.Job.find({ _creator: user.id }).exec();
    }

    res.render('profile/index', {
      pos: 'jobs',
      jobs: jobs,
      user: user
    });
  });
}

function changeUserInfo(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  co(function* () {
    let user = yield gModels.User.findOne({
      _id: req.currentUser.id
    }).exec();

    _.merge(user, req.body);

    try {
      yield user.save();
    } catch(err) {
      console.error(err);
      return res.json({
        error: 1,
        errors: _.mapValues(err.errors, function(e) {
          return e.message;
      })});
    }

    return res.json({ error: 0 });
  });
}

exports = module.exports = {
  index:    index,
  userInfo: userInfo,
  jobs:     jobs,
  changeUserInfo: changeUserInfo,
};
