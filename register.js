var app = require('./app.js');
const MongoDB = require('./mongodb.js');
const db = MongoDB.getDB();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/api/users/register',async function(req, res){
  var name = "";
  var email = "";
  MongoDB.connectDB(async (err) => {
      if (err) {
         console.log("Not Conncted!!!!");
      }else {
        console.log("Conncted!!!!");
      }
      // Load db & collections
      try {
          console.log("body -"+ JSON.stringify(req.body));

         name = req.body.name;
         email = req.body.email;
        console.log(`body - +${name}`);

          let cursor = registerNewUser(name,email,function(err, result) {
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



  // registerNewUser
const registerNewUser = async function (name,email, callback) {
  console.log(`registerNewUser- inputs - +${name}`);
  console.log(`registerNewUser- inputs - +${email}`);
  var myobj = { name: `${name}`, email: `${email}` };

  console.log("registerNewUser- inputs -"+JSON.stringify(myobj));
     const db = MongoDB.getDB();
     const users = db.createCollection("users", function(err, res) {
        if (err) {
          return callback(new Error( 'canot create users collection '   + name ));
        };
        console.log("users - Collection created!");
        db.collection("users").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 user inserted");
            return callback(null, "inserted sucessfully!!" );
          });
     });
}
