var app = require('./app.js');
const MongoDB = require('./mongodb.js');
 // Connect to MongoDB and put server instantiation code inside
 // because we start the connection first
 app.get('/api/getUsers',async function(req, res){
   MongoDB.connectDB(async (err) => {
       if (err) {
          console.log("Not Conncted!!!!");
       }else {
         console.log("Conncted!!!!");
       }
       // Load db & collections
       try {
           let cursor = fetchAllUsers("1",function(err, result) {
             if (err) {
                jsonText = {"meta":{"status": false,"statusCode": 400,"msg":`cannot process these inputs - ${cursor}` },"results":{}};
              }else {
                  jsonText = {"meta":{"status": true,"statusCode": 200,"msg":`sucess` },"results":{"users":result}};
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

// get all lUsers
const fetchAllUsers = async function (id, callback) {
   const db = MongoDB.getDB()
   const users = db.collection('users')
   let cursor = await users.find().toArray(function(err, result) {
   if (err) {
     return callback(new Error( 'No user matching '   + id ));
    }else {
      return callback(null, result);
    }
   });
};


app.get('/api/users/getUser/:username', async function(req, res){
  MongoDB.connectDB(async (err) => {
      if (err) {
         console.log("Not Conncted!!!!");
      }else {
        console.log("Conncted!!!!");
      }
      // Load db & collections
      var id = req.params.username;
        console.log(`id : ${id}`);
      try {
          let cursor = fetchUser(id,function(err, result) {
            if (err) {
               jsonText = {"meta":{"status": false,"statusCode": 400,"msg":`cannot process these inputs ` },"results":{}};
             }else {
                 jsonText = {"meta":{"status": true,"statusCode": 200,"msg":`sucess` },"results":{"user_details":result}};
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

// get user
const fetchUser = async function (id, callback) {
     console.log("input -- "+id);
     var mongo = require('mongodb');
     var o_id = new mongo.ObjectID(id);
   const db = MongoDB.getDB()


   const users = db.collection('users')
    var query = { _id: o_id };
   let cursor = await users.findOne(query,function(err, result) {
   if (err) {
       console.log("No user matching user  ");
     return callback(new Error( 'No user matching ' ));
    }else {
      console.log("matching user! "+result);
      return callback(null, result);
    }
   });
};
