var app = require('./app.js');
var log = require('./log.js');

var message = "Welcome to node express API..!!, crasfted with love.. "
module.exports = message;


var appWelcome= app.get('/', function(req, res){
    log.info(JSON.stringify(message));
    res.send(JSON.stringify(message));
  res.end();
});
