'use strict'

const co = require('co');
const _  = require('lodash');

function index(req, res, next) {
}

function show(req, res, next) {
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
}

function update(req, res, next) {
}

exports = module.exports = {
  index:  index,
  show:   show,
  nnew:   nnew,
  create: create,
  edit:   edit,
  update: update
};

