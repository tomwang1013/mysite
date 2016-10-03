'use strict';

const gridfs = require('../lib/gridfs');

// download a file from gridfs and send it to client
function index(req, res, next) {
  let filename = req.params.filename;

  gridfs.downloadFile(filename).pipe(res);
}

exports = module.exports = {
  index:  index
};
