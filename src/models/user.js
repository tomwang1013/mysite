import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let userSchema = Schema({
  name:     String, // 用户名
  email:    String, // 邮箱
  phone:    String, // 电话号码
  password: String, // 加密后的密码
  cate:     Number  // 用户类型：0:个人,1:企业
});

let User = mongoose.model('User', userSchema);

export default User;
