var mongoose = require('mongoose');
var _Schema = mongoose.Schema;

var dbUri = "mongodb://localhost:27017/mydb";

const getSchema = () => _Schema
const getMongoose = () => mongoose
//mongoose.connect('mongodb://localhost:27017/mydb');
var connectMongooseDB = async (callback) => {
    try {
      mongoose.connect(dbUri,{ useNewUrlParser: true}, function(err) {
       if (err) throw err;
       return callback(null,mongoose);
      });
    } catch (e) {
        throw e
    }
}

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbUri);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
module.exports.mongoose = mongoose;
module.exports.connectMongooseDB = connectMongooseDB;
module.exports.getSchema = getSchema;
//module.exports = {connectMongooseDB,getMongoose,getSchema}
