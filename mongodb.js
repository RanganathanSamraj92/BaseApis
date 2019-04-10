const MongoClient = require('mongodb').MongoClient
var dbURI = "mongodb://localhost:27017/mydb";
let _db
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGOLAB_URI;
}

 const connectDB = async (callback) => {
     try {
         MongoClient.connect(dbURI,{ useNewUrlParser: true }, (err, db) => {
               _db = db.db("mydb");
             return callback(err)
         })
     } catch (e) {
         throw e
     }
 }

 const getDB = () => _db

 const disconnectDB = () => _db.close()

 module.exports = { connectDB, getDB, disconnectDB }
