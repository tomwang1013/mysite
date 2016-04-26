import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let enterpriseSchema = Schema({
  entName:      String, // 企业名称
  website:      String, // 企业网站
  _userId:      Schema.Types.ObjectId
});

let Enterprise = mongoose.model('Enterprise', enterpriseSchema);

export default Enterprise;
