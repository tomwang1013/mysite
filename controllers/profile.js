'use strict'

const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const gridfs = require('../lib/gridfs');
const gm = require('gm');
const path = require('path');
const fs = require('fs');
const async = require('async');

function index(req, res, next) {
  res.redirect(301, '/profile/user_info');
}

function userInfo(req, res, next) {
  Promise.all([
    gModels.User.findOne({ _id: req.currentUser.id }).exec(),
    gModels.University.all(),
    gModels.Major.all()
  ]).then(function(result) {
    res.render('profile/index', {
      pos:          'user_info',
      universities: result[1],
      majors:       result[2],
      entryDates:   gModels.User.allEntryDates,
      businesses:   gModels.Business,
      scales:       gModels.User.scales,
      maturities:   gModels.User.maturities,
      user:         result[0],
      currentUser:  req.currentUser
    });
  }).catch(next);
}

/**
 * 职位信息
 */
function jobs(req, res, next) {
  co(function* () {
    let jobs;
    let appliedJobs;
    let status = req.query.status || 'all';

    if (req.currentUser.type == 0) {
      let query  = { _user: req.currentUser.id };

      if (status == 'replied') {
        query.status = { $ne: 0 };
      } else if (status == 'unreplied') {
        query.status = 0;
      }

      appliedJobs = yield gModels.ApplyJob.find(query).populate({
        path:     '_job',
        populate: { path: '_creator' }
      }).exec();
    } else {
      jobs = yield gModels.Job.find({ _creator: req.currentUser.id }).exec();
    }

    res.render('profile/index', {
      pos:          'jobs',
      appliedJobs:  appliedJobs,
      jobs:         jobs,
      status:       status,
      currentUser:  req.currentUser 
    });
  }).catch(next);
}

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

// account and password
function account(req, res, next) {
  gModels.User.findById(req.currentUser.id, function(err, user) {
    res.render('profile/index', {
      pos:         'account',
      user:        user,
      currentUser: req.currentUser,
      flash:       {
        success: req.flash('success')[0],
        error:   req.flash('error')[0]
      }
    });
  });
};

function changeAccount(req, res, next) {
  co(function* () {
    var user = yield gModels.User.findById(req.currentUser.id).exec();
    _.merge(user, req.body);
    yield user.save();
    res.redirect('/profile/account');
  }).catch(next);
};

// 修改密码
function changePassword(req, res, next) {
  var oldPwd = req.body.old_pwd;
  var newPwd = req.body.new_pwd;
  var cNewPwd = req.body.c_new_pwd;

  if (newPwd != cNewPwd) {
    req.flash('error', '新密码确认错误');
    return res.redirect('/profile/account');
  }

  co(function *() {
    var user = yield gModels.User.findById(req.currentUser.id).exec();
    let match = yield new Promise(function(resolve, reject) {
      bcrypt.compare(oldPwd, user.password, function(err, match) {
        return resolve(match);
      });
    });

    if (!match) {
      req.flash('error', '密码不正确');
      return res.redirect('/profile/account');
    }

    let newHashedPwd = yield new Promise(function(resolve) {
      bcrypt.hash(newPwd, 10, function(err, hash) {
        return resolve(hash);
      });
    });

    user.password = newHashedPwd;
    yield user.save()

    req.flash('success', '密码修改成功');
    res.redirect('/profile/account');
  }).catch(next);
};

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
      res.json({ error: 0, size: result[0], url: resizePath.slice(6) });
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
  let fullFilePath = path.join(gRoot, 'public', req.body.origin_img_path);

  co(function* () {
    let user = yield gModels.User.findById(req.currentUser.id);

    // 上传裁剪后的图
    let aStream = gm(fullFilePath).crop(req.body.width,
                                        req.body.height,
                                        req.body.x,
                                        req.body.y).stream();
    yield gridfs.uploadStream(aStream, filename),

    // 保存文件名
    user.avatar = filename;
    yield user.save()

    // 删除中间文件
    yield new Promise(function(resolve, reject) {
      fs.unlink(fullFilePath, function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ error: 0, url: gridfs.getUrlByFileName(filename) });
  }).catch(next);
}

function message(req, res, next) {
  co(function* () {
    let messages = yield gModels.Message.find({
      userId: req.currentUser.id
    }).populate('_job').exec();

    res.render('profile/index', {
      messages: messages,
      pos: 'message'
    });
  }).catch(next);
}

function messageStatus(req, res, next) {
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
  index:          index,
  userInfo:       userInfo,
  account:        account,
  jobs:           jobs,
  message:        message,
  messageStatus:  messageStatus,
  setMsgRead:     setMsgRead,
  changeUserInfo: changeUserInfo,
  changeAccount:  changeAccount,
  changePassword: changePassword,
  changeAvatar:   changeAvatar,
  changeAvatar2:  changeAvatar2,
};
