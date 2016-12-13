'use strict'

const co = require('co');
const _  = require('lodash');

function index(req, res, next) {
  co(function* () {
    let jobId = req.params.jid;
    let job = yield gModels.Job.findById(jobId).exec();
    let questions = yield gModels.Question.find({
      _job: jobId,
      deleted: 0
    }).exec();

    res.render('questions/index', {
      job: job,
      questions: questions
    });
  }).catch(next); 
}

function nnew(req, res, next) {
  let jobId = req.params.jid;

  gModels.Job.findById(jobId, function(err, job) {
    if (err) return next(err);

    res.render('questions/new', {
      job: job
    });
  });
}

function create(req, res, next) {
  co(function* () {
    let jobId = req.params.jid;
    let job = yield gModels.Job.findById(jobId).exec();
    let newQuestion = yield gModels.Question.create({
      level:   req.body.level,
      content: req.body.content,
      deleted: 0,
      _job:    jobId
    });

    res.redirect('/job/' + jobId + '/questions');
  }).catch(next);
}

// 问题详情页:
// 用户未登陆：
//  展示解答按钮，点击后进入登陆页面，登陆后进入问题解答页面
// 用户已登陆：
//  学生：
//    已解答：展示答案，和答案详情页一样
//    未解答：展示解答按钮，点击后进入解答页面
//  企业：
//    如果是当前企业出的问题，展示编辑按钮
//    如果不是，403
function show(req, res, next) {
  let jobId = req.params.jid;
  let questionId = req.params.qid;
  let status;

  co(function* () {
    let question = yield gModels.Question.findById(questionId).populate('_job').exec();
    let job = question._job;
    let answer;

    if (req.currentUser) {
      if (req.currentUser.type == 0) {
        answer = yield gModels.Answer.findOne({
          _question: question.id,
          _user: req.currentUser.id
        }).exec();

        if (answer) {
          status = 'hasAnswer';
        } else {
          status = 'toAnswer';
        }
      } else {
        if (job._creator == req.currentUser.id) {
          status = 'toEdit';
        } else {
          return next(new Error('access denied'));
        }
      }
    } else {
      status = 'toAnswer';
    }

    res.render('questions/show', { job, question, status, answer });
  }).catch(next);
}

function edit(req, res, next) {
  let jobId = req.params.jid;
  let questionId = req.params.qid;

  co(function* () {
    let a = yield {
      job: gModels.Job.findById(jobId).exec(),
      question: gModels.Question.findById(questionId).exec()
    };

    res.render('questions/edit', {
      job: a.job,
      question: a.question
    });
  }).catch(next);
}

function update(req, res, next) {
  let questionId = req.params.qid;

  co(function* () {
    let question = yield gModels.Question.findById(questionId).exec();

    _.assign(question, _.pick(req.body, ['level', 'content', 'deleted']));

    yield question.save();

    res.redirect('/job/' + req.params.jid + '/questions');
  }).catch(next);
}

// 和job无关的全部question搜索
function search(req, res, next) {
  let page    = req.query.page ? parseInt(req.query.page) : 1;
  let perPage = req.query.per_page ? parseInt(req.query.per_page) : 20;
  let skip    = (page - 1) * perPage;

  let q = gModels.find().populate([
    { path: '_tag', select: 'name' },
    { path: '_creator', select: 'name' }
  ]);

  if (req.query.tag_id) {
    q = q.where({ _tag: req.query.tag_id });
  }

  if (req.query.company_id) {
    q = q.where({ _creator: req.query.company_id });
  }

  q.exec(function(err, questions) {
    if (err) return next(err);

    res.render('questions/search', { questions });
  });
}

exports = module.exports = {
  index, nnew, create, edit, update, show, search
};
