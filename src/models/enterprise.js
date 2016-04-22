import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let enterpriseSchema = Schema({
  entName:      String, // 企业名称
  trade:        String, // 行业
  website:      String, // 企业网站
  description:  String, // 简介
  _userId:       Schema.Types.ObjectId
});

let Enterprise = mongoose.model('Enterprise', enterpriseSchema);

export default Enterprise;
