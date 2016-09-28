/*
 * handling file upload & download from gridfs
 * http://mongodb.github.io/node-mongodb-native/2.2/tutorials/gridfs/streaming/
 */

// get full url
exports.getUrlByFileName = function(filename) {
  return '/uploads/' + filename;
};

// TODO upload file to gridfs
// path: full path of the file in local fs system
exports.uploadFile = function(path) {
  // upload to gridfs and delete the file
};

// TODO download the file from gridfs and pipe it to res
exports.downloadFile = function(filename, res) {
}
