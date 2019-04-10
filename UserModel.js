const mongoose = require('mongoose');
var userSchema = mongoose.Schema({
  name : String,
  email: String
});
mongoose.model('MyUserModel', userSchema);
