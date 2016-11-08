'use strict'

const mongoose = require('mongoose');

/**
 * 消息通知：
 * 1. 用户申请的职位有回复
 */
let Schema = mongoose.Schema;
let messageSchema = new Schema({
  type:   Number,   // 类型
  jobId:  Schema.Types.ObjectId,
  read:   Boolean,  // 是否已读
}, {
  timestamps: true
});


let Message = mongoose.model('Message', messageSchema);

exports = module.exports = Message;
