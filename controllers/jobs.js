'use strict'

var _ = require('lodash');

function index(req, res, next) {
  gModels.Job.find({}, function(err, jobs) {
    res.render('jobs/index', { jobs: jobs });
  });
}

function newJob(req, res, next) {
  res.render('jobs/new');
}

function create(req, res, next) {
  gModels.Job.create(_.pick(req.body, ['title', 'duty', 'requirement'])).then(function(job) {
    res.redirect(301, '/jobs');
  });
}

function edit(req, res, next) {
}

function update(req, res, next) {
}

exports = module.exports = {
  index:  index,
  newJob: newJob,
  create: create,
  edit:   edit,
  update: update
};
