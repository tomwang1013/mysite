'use strict'

const _        = require('lodash');
const mongoose = require('mongoose');
const co       = require('co');

// 职位列表搜索
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
      cond['address'] = req.query.address;
    }

    let result = yield {
      jobs:  gModels.Job.find(cond).populate('_creator').skip(skip).limit(perPage).exec(),
      total: gModels.Job.find(cond).count().exec()
    };

    res.render('jobs/index', _.assign({
      jobs:       result.jobs,
      page:       page,
      pages:      Math.ceil(result.total / perPage),
      businesses: gModels.Business,
      types:      gModels.JobType,
      salaries:   gModels.Job.salaries,
      seo:        { title: '搜索实习岗位' }
    }, req.query));
  }).catch(next);
}

// 新建职位
function newJob(req, res, next) {
  res.render('jobs/new', {
    businesses: gModels.Business,
    types:      gModels.JobType,
    salaries:   gModels.Job.salaries,
    seo:        { title: '新建实习职位' }
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

// 创建职位
function create(req, res, next) {
  gModels.Job.create(_.merge(req.body, { _creator: req.currentUser.id })).then(function(job) {
    res.json({ error: 0, location: '/profile/jobs' });
  }).catch(next)
}

// 编辑职位
function edit(req, res, next) {
  var jobId = req.params.id;

  gModels.Job.findById(jobId).populate('_creator').exec(function(err, job) {
    if (job._creator.id != req.currentUser.id) {
      return next(new Error({ code: 403 }));
    }

    res.render('jobs/edit', {
      job: job,
      businesses: gModels.Business,
      types:      gModels.JobType,
      salaries:   gModels.Job.salaries
    });
  });
}

function update(req, res, next) {
  var jobId = req.params.id;

  gModels.Job.findById(jobId).populate('_creator').exec(function(err, job) {
    if (job._creator.id != req.currentUser.id) {
      return next(new Error({ code: 403 }));
    }

    _.assign(job, req.body);
    job.save(function(err, updatedJob) {
      if (err) return next(err);
      res.json({ error: 0, location: '/profile/jobs' });
    });
  });
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

  gModels.Job.findById(jobId).populate(['_creator', {
    path:     '_appliers',
    populate: { path: '_user' }
  }]).exec(function(err, job) {
    if (err) return next(err);

    if (job._creator.id != req.currentUser.id) {
      return next(new Error({ code: 403 }));
    }

    res.render('jobs/appliers', {
      job:      job,
      appliers: job._appliers
    });
  })
}

// 处理学生的职位申请请求
function handleApply(req, res, next) {
  var userId = req.body.userId;
  var jobId = req.body.jobId;
  var status = req.body.status;
  var message = req.body.message;

  co(function* () {
    let job   = yield gModels.Job.findById(jobId).populate('_creator').exec();

    if (job._creator.id != req.currentUser.id) {
      throw new Error({ code: 403 });
    }

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

// 删除职位
function remove(req, res, next) {
  var jobId = req.params.id;

  co(function* () {
    let job   = yield gModels.Job.findById(jobId).populate('_creator').exec();

    if (job._creator.id != req.currentUser.id) {
      throw new Error({ code: 403 });
    }

    yield [
      gModels.Job.update({ _id: jobId }, { deleted: 1 }).exec(),
      gModels.Question.update({ _job: jobId }, { deleted: 1 }, { multi: true }).exec()
    ];

    req.flash('info', '删除职位成功');
    res.json({ error: 0, location: '/profile/jobs'});
  }).catch(next);
};

exports = module.exports = {
  index, newJob, create, edit, update, apply, appliers,
  handleApply, show, remove
};
