'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let enterpriseSchema = Schema({
  entName:      String, // 企业名称
  website:      String, // 企业网站
  _userId:      Schema.Types.ObjectId
});

let Enterprise = mongoose.model('Enterprise', enterpriseSchema);

exports = module.exports = Enterprise;
