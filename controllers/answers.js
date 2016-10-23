'use strict'

const co = require('co');
const _  = require('lodash');

function index(req, res, next) {
  co(function* () {
    let question = yield gModels.Question.findById(req.params.qid).populate('_job').exec();
    let answers  = yield gModels.Answer.find({
      _question: req.params.qid
    }).populate('_user').exec();

    res.render('answers/index', {
      job:      question._job,
      question: question,
      answers:  answers
    });
  }).catch(next);
}

function show(req, res, next) {
  gModels.Answer.findById(req.params.aid).
    populate({
      path:     '_question',
      populate: { path: '_job' }
    }).exec(function(err, result) {

    if (err) return next(err);

    let answer = result;

    res.render('answers/show', {
      job:      answer._question._job,
      question: answer._question,
      answer:   answer,
    });
  });
}

function nnew(req, res, next) {
  gModels.Question.findById(req.params.qid).
    populate('_job').exec(function(err, result) {
      res.render('answers/new', { question: result });
  });
}

function create(req, res, next) {
  gModels.Answer.create(_.assign({
    score: 0,
    sysScore: 0
  }, req.body), function(err, result) {
    res.redirect('/job/' + result._job);
  })
}

function edit(req, res, next) {
  gModels.Answer.findById(req.params.aid).
    populate({
      path:     '_question',
      populate: { path: '_job' }
    }).exec(function(err, result) {

    if (err) return next(err);

    let answer = result;

    res.render('answers/edit', {
      job:      answer._question._job,
      question: answer._question,
      answer:   answer,
    });
  });
}

function update(req, res, next) {
  gModels.Answer.findById(req.params.aid, function(err, answer) {
    _.assign(answer, req.body);

    if (req.currentUser.type == 1) {
      answer.isScored = true;
    }

    answer.save(function(err, result) {
      res.redirect('/question/' + req.params.qid + '/answer/' + req.params.aid);
    });
  })
}

exports = module.exports = {
  index:  index,
  show:   show,
  nnew:   nnew,
  create: create,
  edit:   edit,
  update: update
};

