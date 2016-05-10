import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let jobSchema = Schema({
  title:        String, // 职位标题
  duty:         String, // 职责
  require:      String, // 要求
  _entId:       Schema.Types.ObjectId
});

let Job = mongoose.model('Job', jobSchema);

export default Job;
