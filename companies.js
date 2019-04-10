var app = require('./app.js');
var dbo = require('./demo_mongo_db_connection.js');
var MongoClient = require('mongodb').MongoClient;

const fetchAllComapnies = async function (id, callback) {
  // Perform database query that calls callback when it's done
  // This is our fake database
  // Connect
  var url = "mongodb://localhost:27017/mydb";
  let client = await MongoClient.connect(url,{ useNewUrlParser: true });
  let db = await client.db();

  // Run the query
  var query = { name: 'GitHub Inc' };
  let cursor = await db.collection('customers').find(query).toArray(function(err, result) {
    if (err) {
      return callback(new Error(
        'No user matching '
         + id
        )
      );
     }else {
       return callback(null, result);
     }
  });



};




app.get('/api/getCompany',async function(req, res){
  var taskId= req.query.taskId;
    var value= req.query.value;
    var jsonText ="";
     //await new Promise(resolve => setTimeout(resolve, 1000));

     // Connect
     var url = "mongodb://localhost:27017/mydb";
     let client = await MongoClient.connect(url,{ useNewUrlParser: true });
     let db = await client.db();

     // Run the query
     var query = { name: 'GitHub Inc' };
     let cursor = fetchAllComapnies("1",function(err, result) {
       if (err) {
          jsonText = {"meta":{"status": false,"statusCode": 400,"msg":`cannot process these inputs - ${cursor}` },"results":{}};
        }else {
            jsonText = {"meta":{"status": false,"statusCode": 400,"msg":`sucess` },"results":{"companies":result}};
            res.send(JSON.stringify(jsonText));
            res.end();
        }
     });
});
