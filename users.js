
var app = require('./app.js');
var log = require('./log.js');


var users = {
  'dharma':{"id":1,"name":"Dharmalingam","email":"dharmalingam@shamlatech.com","pubgName":"Dp-28 Dharma"},
  'vino':{"id":2,"name":"Vino Jacob","email":"vino@shamlatech.com","pubgName":"M416 Vino"},
  'tinku':{"id":3,"name":"Tinku Ashok","email":"tinkuashok@shamlatech.com","pubgName":"Kar98 Tinku"},
  'ranga':{"id":4,"name":"Ranaganathan","email":"ranganathan@shamlatech.com","pubgName":"Graza Ranga"}
};

var findUserByUsername = function (username, callback) {
  // Perform database query that calls callback when it's done
  // This is our fake database
  if (!users[username])
    return callback(new Error(
      'No user matching '
       + username
      )
    );
  return callback(null, users[username]);
};

app.get('/api/v1/users/:username', function(request, response) {
  var username = request.params.username;
  var jsonText = "";
  findUserByUsername(username, function(error, user) {
    if (error){
      jsonText = {"meta":{"status": false,"statusCode": 400,"msg":`${error.message}` },"results":{}};
      response.send(JSON.stringify(jsonText));
      response.end();
    } else {
        jsonText = {"meta":{"status": true,"statusCode": 200,"msg": "request processed sucessfully" },"results":{"data":users[username]} };
      response.send(JSON.stringify(jsonText));
      response.end();
    }


  });
});

app.get('/api/v1/users', function(request, response) {
  var username = request.params.username;
  var jsonText = "";
  findUserByUsername(username, function(error, user) {
    jsonText = {"meta":{"status": true,"statusCode": 200,"msg": "request processed sucessfully" },"results":{"data":users} };
  response.send(JSON.stringify(jsonText));
  response.end();


  });
});
