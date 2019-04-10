var express = require('express');
var router = express.Router()
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var mongooseApp = require('./mongooseApp.js');

const host = '0.0.0.0';
const port = process.env.PORT || 3000;


var server = app.listen(port,host, function() {
     console.log(`Server app is ready and we are on port ${port}!`);

     mongooseApp.connectMongooseDB(async (err,mongoose) => {
         if (err) {
            console.log("Not Conncted!!!!");
         }else {
           console.log("Conncted!!!!");
          var appSchemaAssigned = mongoose.Schema;
          require('./Booke.routes.js')(app);

         }
       });
});
app.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

app.use('/demoformat',function (req, res, next) {
  res.send({"status":true,"msg":"empty","data":{"app_version":{"android":{"name":"google","version":"1.0"}}}})
  next()
})

module.exports = app;
