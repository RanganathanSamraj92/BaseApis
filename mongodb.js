const MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/mydb";
let _db

 const connectDB = async (callback) => {
     try {
         MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
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
