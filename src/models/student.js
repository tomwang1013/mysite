import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let studentSchema = Schema({
  xingMing:     String, // 姓名
  schoolName:   String, // 学校名
  major:        String, // 专业
  entranceTime: Date,   // 入学时间
  gender:       Number, // 性别：0:female,1:male
  _userId:      Schema.Types.ObjectId
});

let Student = mongoose.model('Student', studentSchema);

export default Student;
