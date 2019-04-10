var mongooseApp = require('./mongooseApp')
// create a schema
var Schema = mongooseApp.getSchema()
var imageSchema = new Schema({
		token: String,
		image: Object
});
var collectionName = 'images'
var M = mongooseApp.mongoose.model('Image', imageSchema, collectionName);
module.exports = M;
