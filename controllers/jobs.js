'use strict'

const _        = require('lodash');
const mongoose = require('mongoose');
const co       = require('co');

function index(req, res, next) {
  let page    = req.query.page ? parseInt(req.query.page) : 1;
  let perPage = req.query.per_page ? parseInt(req.query.per_page) : 20;
  let skip    = (page - 1) * perPage;

  co(function* () {
    let cond = {};

    if (req.query.title) {
      cond['title'] = { $regex: req.query.title };
    }

    if (req.query.business) {
      cond['business'] = req.query.business;
    }

    if (req.query.type) {
      cond['type'] = req.query.type;
    }

    if (req.query.salary) {
      cond['salary'] = parseInt(req.query.salary);
    }

    if (req.query.address) {
      cond['address'] = parseInt(req.query.address);
    }

    let result = yield {
      jobs:  gModels.Job.find(cond).populate('_creator').skip(skip).limit(perPage).exec(),
      total: gModels.Job.find(cond).count().exec()
    };

    if (req.currentUser && req.currentUser.type === 0) {
      var myAppliedJobs = yield gModels.ApplyJob.find({
        _user: req.currentUser.id
      }, '_job').exec();
      
      result.jobs.forEach(function(job) {
        if (_.find(myAppliedJobs, apply => apply._job == job.id)) {
          job.applied = true;
        }
      });
    }

    res.render('jobs/index', _.assign({
      jobs:       result.jobs,
      page:       page,
      pages:      Math.ceil(result.total / perPage),
      businesses: gModels.Business,
      types:      gModels.JobType,
      salaries:   gModels.Job.salaries
    }, req.query));
  }).catch(next);
}

function newJob(req, res, next) {
  res.render('jobs/new', {
    businesses: gModels.Business,
    types:      gModels.JobType,
    salaries:   gModels.Job.salaries
  });
}

/**
 * 职位详情页：
 * 当前用户：
 *  企业：
 *    自己创建的：编辑，删除，统计信息(多少人已申请)
 *    其他企业创建的：no op
 *  学生：
 *    已申请：申请状态(是否已申请及申请结果)
 *    未申请：立即申请
 *  未登陆：立即申请
 */
function show(req, res, next) {
  co(function* () {
    let job = yield gModels.Job.findById(req.params.id).populate('_creator').exec();

    if (!job) {
      throw new Error({ code: 404 });
    }

    let locals = {
      job:        job,
      company:    job._creator
    };

    if (req.currentUser) {
      if (req.currentUser.type == 0) {
        locals.applyStatus = yield gModels.ApplyJob.findOne({
          _job:  job.id,
          _user: req.currentUser.id
        }).exec();
      } else if (req.currentUser.id == job._creator.id) {
        locals.isMyJob = true;
      }
    }

    res.render('jobs/show', locals);
  }).catch(next);
}

function create(req, res, next) {
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
  }).catch(next);
}

// 管理申请者
function appliers(req, res, next) {
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

  co(function* () {
    let dbOps = yield {
      applyJob: gModels.ApplyJob.update({
          _user:  userId,
          _job:   jobId
        }, {
          status:   status,
          message:  message
        }).exec(),

      createMessage: gModels.Message.create({
        type:   1,
        userId: userId,
        read:   false,
        _job:   jobId
      })
    }

    res.json({ error: null });
  }).catch(next);
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
