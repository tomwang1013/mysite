'use strict'

/*
 * handling file upload & download from gridfs
 * http://mongodb.github.io/node-mongodb-native/2.2/tutorials/gridfs/streaming/
 */

const mongoose = require('mongoose');
const mongodb = mongoose.mongo;
const fs = require('fs');
const path = require('path');

// get full url
exports.getUrlByFileName = function(filename) {
  return '/uploads/' + filename;
};

// upload file to gridfs
// fullPath: full path of the file in local fs system
exports.uploadFile = function(fullPath, filename) {
  // upload to gridfs and delete the file
  let db = mongoose.connection.db;
  let bucket = new mongodb.GridFSBucket(db);

  fullPath = path.join(gRoot, fullPath);

  return new Promise(function(resolve, reject) {
    fs.createReadStream(fullPath).
      pipe(bucket.openUploadStream(filename)).
      on('error', reject).
      on('finish', function() {
        fs.unlink(fullPath, resolve);
      });
  });
};

// download the file from gridfs
exports.downloadFile = function(filename) {
  let db = mongoose.connection.db;
  let bucket = new mongodb.GridFSBucket(db);

  return bucket.openDownloadStreamByName(filename);
}
