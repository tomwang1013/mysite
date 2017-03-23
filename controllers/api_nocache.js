'use strict'

/*
 * get current user's info
 */
function userInfo(req, res, next) {
  gModels.User.findById(req.currentUser.id).exec().then(function(user) {
    user.avatarUrl = user.avatarUrl();
    res.json(user);
  }).catch(next);
}

function appliedJobs(req, res, next) {
  let status = req.query.status || 'all';
  let query  = { _user: req.currentUser.id };

  if (status == 'replied') {
    query.status = { $ne: 0 };
  } else if (status == 'unreplied') {
    query.status = 0;
  }

  gModels.ApplyJob.find(query).populate({
    path:     '_job',
    populate: { path: '_creator' }
  }).exec(function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
}

function createdJobs(req, res, next) {
  gModels.Job.find({
    _creator: req.currentUser.id,
    deleted: 0
  }).exec(function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
}

function messages(req, res, next) {
  gModels.Message.find({
    userId: req.currentUser.id
  }).populate('_job').exec(function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
}

module.exports = {
  userInfo,
  appliedJobs,
  createdJobs,
  messages
};
