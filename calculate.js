var app = require('./app.js');

app.get('/api/calculate',async function(req, res){
  var taskId= req.query.taskId;
    var value= req.query.value;
    var jsonText ="";
     await new Promise(resolve => setTimeout(resolve, 2000));

    if (taskId==0 && value==0) {
        jsonText = {"meta":{"status": false,"statusCode": 400,"msg":`cannot process these inputs - ${taskId},${value}` },"results":{}};
    }else {
      jsonText = {"meta":{"status": true,"statusCode": 200,"msg":"your request processed sucessfully"},"results":{"sum":taskId*value}};
    }

  res.send(JSON.stringify(jsonText));
  res.end();
});
