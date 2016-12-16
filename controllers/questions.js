'use strict'

const co = require('co');
const _  = require('lodash');

// 查看某个职位下的所有问题列表
// 区分用户类型：
// 企业：可以编辑或删除问题
// 学生或未登陆用户：去解答
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
      questions: questions,
      isMyJob: req.currentUser && req.currentUser.id == job._creator
    });
  }).catch(next); 
}

// 创建为题
function nnew(req, res, next) {
  let jobId = req.params.jid;

  gModels.Job.findById(jobId, function(err, job) {
    if (err) return next(err);

    res.render('questions/new', {
      job:      job,
      quesTags: gModels.QuesTag
    });
  });
}

function create(req, res, next) {
  if (req.body.labels) {
    req.body.labels = req.body.labels.split(',');
  }

  co(function* () {
    let jobId = req.params.jid;
    let job = yield gModels.Job.findById(jobId).exec();

    if (job._creator != req.currentUser.id) {
      throw new Error({ code: 403 });
    }

    yield [
      // create question
      gModels.Question.create(_.assign({
          _job:     jobId,
          _creator: req.currentUser.id
      }, req.body)),

      // update question count of each label
      gModels.QuesLabel.update({
        name: { $in: req.body.labels },
      }, {
        $inc: { ques_cnt: 1 }
      }).exec()
    ];

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

// 编辑问题
function edit(req, res, next) {
  let jobId = req.params.jid;
  let questionId = req.params.qid;

  co(function* () {
    let a = yield {
      job: gModels.Job.findById(jobId).exec(),
      question: gModels.Question.findById(questionId).exec()
    };

    if (a.job._creator != req.currentUser.id) {
      throw new Error({ code: 403 });
    }

    res.render('questions/edit', {
      job:      a.job,
      question: a.question,
      quesTags: gModels.QuesTag
    });
  }).catch(next);
}

function update(req, res, next) {
  let questionId = req.params.qid;

  if (req.body.labels) {
    req.body.labels = req.body.labels.split(',');
  }

  co(function* () {
    let question = yield gModels.Question.findById(questionId).exec();

    if (question._creator != req.currentUser.id) {
      throw new Error({ code: 403 });
    }

    _.assign(question, req.body);

    let deletedLabels = _.difference(question.labels, req.body.labels);

    yield [
      question.save(),

      // update question count of each deleted label
      gModels.QuesLabel.update({
        name: { $in: deletedLabels },
      }, {
        $inc: { ques_cnt: -1 }
      }).exec(),

      // update question count of each label
      gModels.QuesLabel.update({
        name: { $in: req.body.labels },
      }, {
        $inc: { ques_cnt: 1 }
      }).exec()
    ];

    res.redirect('/job/' + req.params.jid + '/questions');
  }).catch(next);
}

// 普通用户的问题搜索
function search(req, res, next) {
  let page    = req.query.page ? parseInt(req.query.page) : 1;
  let perPage = req.query.per_page ? parseInt(req.query.per_page) : 20;
  let skip    = (page - 1) * perPage;

  let q = gModels.Question.find().populate({
    path: '_creator',
    select: 'name'
  });

  if (req.query.tag_id) {
    q = q.where({ _tag: req.query.tag_id });
  }


  if (req.query.company_id) {
    q = q.where({ _creator: req.query.company_id });
  }

  q.exec(function(err, questions) {
    if (err) return next(err);

    res.render('questions/search', {
      questions,
      quesTags: gModels.QuesTag,
      curTag: req.query.tag
    });
  });
}

exports = module.exports = {
  index, nnew, create, edit, update, show, search
};
