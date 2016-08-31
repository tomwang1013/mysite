'use strict'

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  res.status(500).send('出错了');
}

exports = module.exports = errorHandler;
