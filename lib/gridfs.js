'use strict'

/*
 * handling file upload & download from gridfs
 * http://mongodb.github.io/node-mongodb-native/2.2/tutorials/gridfs/streaming/
 */

const mongoose = require('mongoose');
const mongodb = mongoose.mongo;
const fs = require('fs');
const path = require('path');

// download path
exports.downloadPath = function(filename) {
  return '/download/' + filename;
};

// upload path
exports.uploadPath = function(filename) {
  return '/upload/' + filename;
};

exports.addSuffix2Img = function(filename, suffix) {
  let dot = filename.lastIndexOf('.');

  return filename.slice(0, dot) + '-' + suffix + filename.slice(dot);
}

// upload file to gridfs
// fullPath: full path of the file in local fs system
// filename: gridfs filename
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

// upload file to gridfs
// aStream: stream to be pipe to gridfs
// filename: gridfs filename
exports.uploadStream = function(aStream, filename) {
  let db = mongoose.connection.db;
  let bucket = new mongodb.GridFSBucket(db);

  return new Promise(function(resolve, reject) {
    aStream.pipe(bucket.openUploadStream(filename)).
      on('error', reject).
      on('finish', resolve);
  });
};

// download the file from gridfs
exports.downloadFile = function(filename) {
  let db = mongoose.connection.db;
  let bucket = new mongodb.GridFSBucket(db);

  return bucket.openDownloadStreamByName(filename);
}
