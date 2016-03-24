import mongoose from 'mongoose';

let userSchema = mongoose.Schema({
  email: String,
  password: String
});

let User = mongoose.model('User', userSchema);

export default User;
