const co      = require('co');
const _       = require('lodash');
const bcrypt  = require('bcrypt');
const gm      = require('gm');
const path    = require('path');
const fs      = require('fs');
const async   = require('async');
const gridfs  = require('../lib/gridfs');
const url     = require('url');

// 基本信息
function index(req, res, next) {
  res.render('profile/index');
}

// 修改用户基本信息
function changeUserInfo(req, res, next) {
  co(function* () {
    let user = yield gModels.User.findOne({
      _id: req.currentUser.id
    }).exec();

    _.merge(user, req.body);

    try {
      yield user.save();
    } catch(err) {
      console.error(err);
      return res.json({
        error: 1,
        errors: _.mapValues(err.errors, function(e) {
          return e.message;
      })});
    }

    return res.json({ error: 0 });
  });
}

// 修改账号信息: user name, email, phone
function changeAccount(req, res, next) {
  co(function* () {
    let user = yield gModels.User.findById(req.currentUser.id).exec();

    _.merge(user, _.pick(req.body, 'name', 'email', 'phone'));

    yield user.save();

    res.json({ error: 0 });
  }).catch(next);
}

// 修改密码
function changePassword(req, res, next) {
  let oldPwd = req.body.old_pwd;
  let newPwd = req.body.new_pwd;
  let cNewPwd = req.body.c_new_pwd;

  if (newPwd !== cNewPwd) {
    return res.json({
      error: 1,
      errors: { c_new_pwd: '新密码2次输入不一致' }
    });
  }

  co(function *() {
    let user = yield gModels.User.findById(req.currentUser.id).exec();
    let match = yield new Promise(function(resolve, reject) {
      bcrypt.compare(oldPwd, user.password, function(err, match) {
        return resolve(match);
      });
    });

    if (!match) {
      return res.json({
        error: 1,
        errors: { old_pwd: '密码错误' }
      });
    }

    user.password = yield new Promise(function(resolve) {
      bcrypt.hash(newPwd, 10, function(err, hash) {
        return resolve(hash);
      });
    });

    yield user.save();

    res.json({ error: 0 });
  }).catch(next);
}

// 修改头像第一步：
// 上传原图，缩放得到中间图
function changeAvatar(req, res, next) {
  if (!req.file) {
    return next(new Error('no avatar found'));
  }

  let resizePath = gridfs.addSuffix2Img(req.file.path, '400x400');

  gm(path.join(gRoot, req.file.path)).resize(400, 400, '>').
    write(path.join(gRoot, resizePath), function(err) {

    if (err) return next(err);

    async.parallel([
      function(callback) { gm(path.join(gRoot, resizePath)).size(callback); },
      function(callback) { fs.unlink(path.join(gRoot, req.file.path), callback); }
    ], function(err, result) {
      if (err) return next(err);
      res.json({ error: 0, size: result[0], url: `${gConfig.assets_host}${resizePath.slice(6)}`});
    });
  });
}

// 修改头像第二步：
// 根据中间图和裁减参数，得到最终的头像图片，需要的参数如下：
// origin_img_path: 中间图的本地url
// x,y,width,height: 裁减参数
function changeAvatar2(req, res, next) {
  let sepIdx = req.body.origin_img_path.lastIndexOf('/');
  let filename = req.body.origin_img_path.slice(sepIdx + 1);
  let fullFilePath = path.join(
    gRoot,
    'public',
    url.parse(req.body.origin_img_path, false, true).pathname
  );

  co(function* () {
    let user = yield gModels.User.findById(req.currentUser.id);

    // 上传裁剪后的图
    let aStream = gm(fullFilePath).crop(req.body.width,
                                        req.body.height,
                                        req.body.x,
                                        req.body.y).stream();
    yield gridfs.uploadStream(aStream, filename);

    // 保存文件名
    user.avatar = filename;
    gControllers.user.loginUser(res, user);
    yield user.save();

    // 删除中间文件
    yield new Promise(function(resolve, reject) {
      fs.unlink(fullFilePath, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ error: 0, url: gridfs.downloadPath(filename) });
  }).catch(next);
}

// 消息通知状态
function messageStatus(req, res, next) {
  if (!req.currentUser) {
    return res.json({ has_msg: false });
  }

  co(function* () {
    let messages = yield gModels.Message.find({
      userId: req.currentUser.id,
      read:   false
    }).exec();

    res.json({ has_msg: messages.length > 0 });
  }).catch(next);
}

// 将消息标记为已读
function setMsgRead(req, res, next) {
  let msgId = req.body.msg_id;

  gModels.Message.update({ _id: msgId }, { read: true }, function(err, response) {
    if (err) return next(err);

    res.json({ error: 0 });
  });
}

exports = module.exports = {
  index,
  messageStatus, setMsgRead, changeUserInfo,
  changeAccount, changePassword, changeAvatar,
  changeAvatar2
};
