var mongooseApp = require('./mongooseApp')
// create a schema
var Schema = mongooseApp.getSchema()
var bookSchema = new Schema({
		bookName: String,
		author: String,
		genre: String,
		created_at: String,
		releasedDate: String
});
var collectionName = 'books'
var bookModel = mongooseApp.mongoose.model('Book', bookSchema, collectionName);
module.exports = bookModel;
