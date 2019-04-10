const MongoClient = require('mongodb').MongoClient;
var log = require('./log.js')
var url = "mongodb://localhost:27017/mydb";
var dbo="";
var _db;




const connectDB = async (callback) => {
    try {
      MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
        if (err) {
            console.log('Failed to create.'+ err.stack);
            return;
        }
        dbo = db.db("mydb");
        dbo.createCollection("customers", function(err, res) {
          if (err) throw err;
          console.log("Collection created!");

        });
      });
    } catch (e) {
        throw e
    }
}

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( url,{ useNewUrlParser: true }, function( err, db ) {
      _db = db;
      return callback( err );
    } );
  },
  getDB:function(){
    return _db;
  }
}
