import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost/mysite');

let userSchema = mongoose.Schema({
  email: String,
  password: String
});

let User = mongoose.model('User', userSchema);

export default User;
