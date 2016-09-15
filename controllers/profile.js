'use strict'

const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');

function index(req, res, next) {
  res.redirect(301, '/profile/user_info');
}

function userInfo(req, res, next) {
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
      maturities:   gModels.User.maturities,
      user:         result[0],
      currentUser:  req.currentUser
    });
  }).catch(function(err) {
    next(err);
  });
}

function jobs(req, res, next) {
  co(function* () {
    let jobs;
    let appliedJobs;

    if (req.currentUser.type == 0) {
      appliedJobs = yield gModels.ApplyJob.find({
        _user: req.currentUser.id
      }).populate({
        path:     '_job',
        populate: { path: '_creator' }
      }).exec();
    } else {
      jobs = yield gModels.Job.find({ _creator: req.currentUser.id }).exec();
    }

    res.render('profile/index', {
      pos:          'jobs',
      appliedJobs:  appliedJobs,
      jobs:         jobs,
      currentUser:  req.currentUser 
    });
  }).catch(function(err) {
    next(err);
  });
}

function changeUserInfo(req, res, next) {
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

// account and password
function account(req, res, next) {
  gModels.User.findOne({ _id: req.currentUser.id }, function(err, user) {
    res.render('profile/index', {
      pos:         'account',
      user:        user,
      currentUser: req.currentUser
    });
  });
};

exports = module.exports = {
  index:          index,
  userInfo:       userInfo,
  account:        account,
  jobs:           jobs,
  changeUserInfo: changeUserInfo,
};
