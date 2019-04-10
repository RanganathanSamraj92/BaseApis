var app = require('./app.js');
const MongoDB = require('./mongodb.js');
 // Connect to MongoDB and put server instantiation code inside
 // because we start the connection first
 app.get('/api/getAllCompanies',async function(req, res){
   MongoDB.connectDB(async (err) => {
       if (err) {
          console.log("Not Conncted!!!!");
       }else {
         console.log("Conncted!!!!");
       }
       // Load db & collections
       try {
           let cursor = fetchAllComapnies("1",function(err, result) {
             if (err) {
                jsonText = {"meta":{"status": false,"statusCode": 400,"msg":`cannot process these inputs - ${cursor}` },"results":{}};
              }else {
                  jsonText = {"meta":{"status": true,"statusCode": 200,"msg":`sucess` },"results":{"companies":result}};
                  res.send(JSON.stringify(jsonText));
                  res.end();
              }
           });
       } catch (e) {
           throw e
       }
       const desired = true
       if (desired) {
           // Use disconnectDB for clean driver disconnect
           //MongoDB.disconnectDB()
           //process.exit(0)
       }
       // Server code anywhere above here inside connectDB()
   })
 });

// get all companies
const fetchAllComapnies = async function (id, callback) {
   const db = MongoDB.getDB()
   const users = db.collection('customers')
   var query = { name: 'GitHub Inc' };
   let cursor = await users.find().toArray(function(err, result) {
   if (err) {
     return callback(new Error( 'No user matching '   + id ));
    }else {
      return callback(null, result);
    }
   });

};

// insert cmpany
const addComapny = async function (id, callback) {
     const db = MongoDB.getDB()
     const customers = db.collection('customers')
     var query = { name: 'GitHub Inc' };
     let cursor = await customers.find().toArray(function(err, result) {
     if (err) {
       return callback(new Error( 'No user matching '   + id ));
      }else {
        return callback(null, result);
      }
     });
 };
