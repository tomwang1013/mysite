'use strict'

const _        = require('lodash');
const mongoose = require('mongoose');
const co       = require('co');

function index(req, res, next) {
  co(function* () {
    var jobs = gModels.Job.find().populate('_creator');

    if (req.query.title) {
      jobs = jobs.regex('title', req.query.title);
    }

    if (req.query.business) {
      jobs = jobs.where('business', req.query.business);
    }

    if (req.query.type) {
      jobs = jobs.where('type', req.query.type);
    }

    if (req.query.salary) {
      jobs = jobs.where('salary', parseInt(req.query.salary));
    }

    if (req.query.address) {
      jobs = jobs.where('address', parseInt(req.query.address));
    }

    jobs = yield jobs.exec();

    if (req.currentUser && req.currentUser.type === 0) {
      var myAppliedJobs = yield gModels.ApplyJob.find({
        _user: req.currentUser.id
      }).exec()
      
      myAppliedJobs = myAppliedJobs.map(function(ap) {
        return ap._job.toString();
      });

      jobs.forEach(function(job) {
        if (myAppliedJobs.indexOf(job.id) >= 0) {
          job.applied = true;
        }
      });
    }

    res.render('jobs/index', {
      jobs:       jobs,
      businesses: gModels.Business,
      types:      gModels.JobType,
      salaries:   gModels.Job.salaries
    });
  }).catch(next);
}

function newJob(req, res, next) {
  res.render('jobs/new', {
    businesses: gModels.Business,
    types:      gModels.JobType,
    salaries:   gModels.Job.salaries
  });
}

function show(req, res, next) {
  co(function* () {
    let job = yield gModels.Job.findById(req.params.id).populate('_creator').exec();

    if (!job) {
      err.code = 404;
      return next(err)
    }


    let applyStatus = '';

    if (req.currentUser) {
      let applied = false;

      if (req.currentUser.type == 0) {
        applied = yield gModels.ApplyJob.findOne({
          _job:  job.id,
          _user: req.currentUser.id
        }).exec();

        if (applied) {
          applyStatus = 'applied';
        } else {
          applyStatus = 'apply';
        }
      }
    } else {
      applyStatus = 'apply';
    }

    res.render('jobs/show', {
      job:          job,
      company:      job._creator,
      applyStatus:  applyStatus
    });
  }).catch(next);
}

function create(req, res, next) {
  if (!req.currentUser) {
    return res.json({ error: 1, message: 'not login' });
  }

  gModels.Job.create(_.merge(req.body, { _creator: req.currentUser.id })).then(function(job) {
    res.json({ error: 0, location: '/jobs' });
  }).catch(function(err) {
    if (err.errors) {
      res.json({ error: 1, errors: _.mapValues(err.errors, function(e) { return e.message; }) });
    } else {
      res.json({ error: 1, message: err.message });
    }
  });
}

function edit(req, res, next) {
  var jobId = req.params.id;

  gModels.Job.findById(jobId, function(err, job) {
    res.render('jobs/edit', {
      job: job,
      businesses: gModels.Business,
      types:      gModels.JobType,
      salaries:   gModels.Job.salaries
    });
  })
}

function update(req, res, next) {
  var jobId = req.params.id;

  gModels.Job.findById(jobId, function(err, job) {
    _.assign(job, req.body);
    job.save(function(err, updatedJob) {
      if (err) {
        console.error(err);
        res.json({ error: 1, errors: _.mapValues(err.errors, function(e) { return e.message; }) });
      } else {
        res.json({ error: 0, location: '/profile/jobs' });
      }
    });
  })
}

// apply for a job
function apply(req, res, next) {
  if (!req.currentUser) {
    res.json({ error: 1, location: '/login', message: '用户未登陆' });
    return;
  }

  var userId = req.currentUser.id;
  var jobId  = req.body.job_id;

  co(function* () {
    var isApplied = yield gModels.ApplyJob.findOne({
      _job:   jobId,
      _user:  userId
    }).exec();

    if (isApplied) {
      return res.json({ error: 0, message: '你已经申请过' });
    }

    var appliedJob = yield gModels.ApplyJob.create({
      status:   0,
      _job:   jobId,
      _user:  userId
    });

    yield gModels.Job.update({ _id: jobId }, {
      $inc:   { _appliersSize: 1 },
      $push:  { _appliers: appliedJob.id }
    }).exec();

    res.json({ error: 0, message: '申请成功' });
  }).catch(function(err) {
    console.error(err);
    res.json({ error: 1, message: '申请失败' });
  });
}

// 管理申请者
function appliers(req, res, next) {
  if (!req.currentUser) {
    res.redirect('/login');
    return;
  }

  var jobId = req.params.id;

  gModels.Job.findById(jobId).populate({
    path:     '_appliers',
    populate: { path: '_user' }
  }).exec(function(err, job) {
    if (err) return next(err);

    res.render('jobs/appliers', {
      job:      job,
      appliers: job._appliers
    });
  })
}

function handleApply(req, res, next) {
  var userId = req.body.userId;
  var jobId = req.body.jobId;
  var status = req.body.status;
  var message = req.body.message;

  gModels.ApplyJob.update({
    _user:  userId,
    _job:   jobId
  }, {
    status:   status,
    message:  message
  }).exec(function(err, result) {
    res.json({ error: err });
  });
}

exports = module.exports = {
  index:        index,
  newJob:       newJob,
  create:       create,
  edit:         edit,
  update:       update,
  apply:        apply,
  appliers:     appliers,
  handleApply:  handleApply,
  show:         show
};
