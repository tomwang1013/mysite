/**
 * 提供ueditor的上传图片及读取配置功能
 */

const gridfs = require('../lib/gridfs');

function index(req, res, next) {
  if (req.query.action === 'config') {
    res.set('Cache-Control', 'max-age=86400');
    res.json({
      /* 上传图片配置项 */
      "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
      "imageFieldName": "upfile", /* 提交的图片表单名称 */
      "imageMaxSize": 2048000, /* 上传大小限制，单位B */
      "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
      "imageCompressEnable": true, /* 是否压缩图片,默认是true */
      "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
      "imageInsertAlign": "none", /* 插入的图片浮动方式 */
      "imageUrlPrefix": "", /* 图片访问路径前缀 */
      "imagePathFormat": "{time}{rand:6}{filename}", /* 上传保存路径,可以自定义保存路径和文件名格式 */

      /* 截图工具上传 */
      "snapscreenActionName": "uploadimage", /* 执行上传截图的action名称 */
      "snapscreenPathFormat": "{time}{rand:6}{filename}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
      "snapscreenUrlPrefix": "", /* 图片访问路径前缀 */
      "snapscreenInsertAlign": "none", /* 插入的图片浮动方式 */
    });
  } else if (req.query.action === 'uploadimage') {
    gridfs.uploadFile(req.file.path, req.file.filename).then(() => {
      res.json({
        "state":    "SUCCESS",
        "url":      gridfs.downloadPath(req.file.filename),
        "title":    req.file.filename,
        "original": req.file.originalname
      });
    }).catch(next);
  } else {
    next(new Error('ueditor invalid operation')); 
  }
}

module.exports = { index };
