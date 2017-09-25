const gridfs = require('../lib/gridfs');

// download a file from gridfs and send it to client
function download(req, res, next) {
  let filename = req.params.filename;

  gridfs.downloadFile(filename).pipe(res);
}

// upload a file to gridfs
function upload(req, res, next) {
  let fileLocalPath = path.join(gRoot, req.file.path);
  let fileName = req.file.originalname;

  gridfs.uploadFile(fileLocalPath, fileName).
    then(() => { res.send(); }).
    catch(next);
}

exports = module.exports = {
  download, upload
};
