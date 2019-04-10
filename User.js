var mongooseApp = require('./mongooseApp.js');
// create a schema
var Schema = mongooseApp.getSchema()
var userSchema = new Schema({
		name: String,
		email: String,
		password: String,
		image: Object,
		mobile: String
});
var collectionName = 'users'
var M = mongooseApp.mongoose.model('User', userSchema, collectionName);
module.exports = M;
