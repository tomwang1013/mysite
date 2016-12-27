'use strict'

const co = require('co');
const _  = require('lodash');

// 某个问题的答案列表
function index(req, res, next) {
  co(function* () {
    let result = yield {
      question: gModels.Question.findById(req.params.qid).populate('_job').exec(),
      answers:  gModels.Answer.find({ _question: req.params.qid }).populate('_user').exec()
    };

    // 企业只能查看其发布的职位的答案列表
    if (req.currentUser.id != result.question._job._creator) {
      return next({ code: 403 });
    }

    res.render('answers/index', {
      job:      result.question._job,
      question: result.question,
      answers:  result.answers
    });
  }).catch(next);
}

// 答案详情
function show(req, res, next) {
  gModels.Answer.findById(req.params.aid).
    populate({
      path:     '_question',
      populate: { path: '_job' }
    }).exec(function(err, result) {

    if (err) return next(err);

    let answer = result;

    // 学生只能查看自己的答案
    // 企业只能查看其发布的职位的答案
    if (req.currentUser.type == 0 && answer._user != req.currentUser.id ||
        req.currentUser.type == 1 && answer._question._job._creator != req.currentUser.id) {
      return next({ code: 403 });
    }

    res.render('answers/show', {
      job:      answer._question._job,
      question: answer._question,
      answer:   answer,
    });
  });
}

// 新建答案
function nnew(req, res, next) {
  gModels.Question.findById(req.params.qid).
    populate('_job').exec(function(err, result) {
    res.render('answers/new', {
      job:      result._job,
      question: result
    });
  });
}

function create(req, res, next) {
  gModels.Answer.create(_.assign({
    score: 0,
    sysScore: 0
  }, req.body), function(err, result) {
    res.redirect('/job/' + req.body._job);
  })
}

// 编辑答案
function edit(req, res, next) {
  gModels.Answer.findById(req.params.aid).
    populate({
      path:     '_question',
      populate: { path: '_job' }
    }).exec(function(err, result) {

    if (err) return next(err);

    let answer = result;

    if (answer._user != req.currentUser.id) {
      return next({ code: 403 });
    }

    res.render('answers/edit', {
      job:      answer._question._job,
      question: answer._question,
      answer:   answer,
    });
  });
}

// 学生能改自己的答案
function update(req, res, next) {
  gModels.Answer.findById(req.params.aid).
    populate({
      path:     '_question',
      populate: { path: '_job' }
    }).exec(function(err, answer) {

    // 学生只能查看自己的答案
    if (answer._user != req.currentUser.id) {
      return next({ code: 403 });
    }

    _.assign(answer, req.body);

    answer.save(function(err, result) {
      res.redirect('/question/' + req.params.qid + '/answer/' + req.params.aid);
    });
  })
}

// 企业能给答案评分
function updateScore(req, res, next) {
  gModels.Answer.findById(req.params.aid).populate('_job').exec(function(err, answer) {

    // 企业只能查看其发布的职位的答案
    if (answer._job._creator != req.currentUser.id) {
      return next({ code: 403 });
    }

    _.assign(answer, req.body, { isScored: true });

    answer.save(function(err, result) {
      res.json({ error: err });
    });
  })
}

// 用户删除答案
function remove(req, res, next) {
  co(function* () {
    let answer = yield gModels.Answer.findById(req.params.aid);

    if (req.currentUser.id != answer._user) {
      return next({ code: 403 });
    }

    answer.remove(function(err, result) {
      res.json({
        error: err,
        location: `/job/${req.body.job_id}/question/${answer._question}`
      });
    });
  });
}

exports = module.exports = {
  index, show, nnew, create, edit,
  update, remove, updateScore
};
