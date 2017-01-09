'use strict'

const _ = require('lodash');

function errorHandler(err, req, res, next) {
  // 统一处理model验证错误
  if (req.xhr && err.name == 'ValidationError' && err.errors) {
    return res.json({
      error: 1,
      errors: _.mapValues(err.errors, function(e) { return e.message; })
    });
  }

  console.error(err.stack);

  res.status(500).send('出错了');
}

exports = module.exports = errorHandler;
