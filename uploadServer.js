var app = require("./app.js");
const multer = require("multer");
var fs = require("fs");
var Image = require('./Image');
var ObjectId = require("mongodb").ObjectID;
var ip = require("ip");
var config = require('./config.js');
var User = require('./User');
var jwt = require('jsonwebtoken');

var fullUrl = '';

var globalResultParam = "Value";
var output = {};
var meta = {};

var status = false;
var msg = "we are sorry! could not generate response!"
meta['status'] = status;
meta['message'] = msg;

output['meta'] = meta;


// SET STORAGE
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/images/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});

var upload = multer({ storage: storage });

app.post("/api/upload/photo", upload.single("file"), (req, res) => {
loginResContent = {};
  var token = req.headers['x-access-token'];
  if (!token) {
    msg = 'No token provided.';
    return getOutput(res,200,loginResContent,status,msg);
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
        msg = 'Failed to authenticate token.';
      return  getOutput(res,200,loginResContent,status,msg);
  }else{
    //find user by id
    User.findById(decoded.id, function (err, user) {
      if (err){
          msg = 'Cant find user pls try again!';
            return getOutput(res,200,loginResContent,status,msg);
      }
      if (!user){
          msg = 'No user found';
            return getOutput(res,200,loginResContent,status,msg);
      }else {
        status = true;
        msg = 'user found';
        loginResContent['user'] = user;
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString("base64");


        // Define a JSONobject for the image attributes for saving to database
        fullUrl = req.socket.localPort;
        var finalImg = {

          contentType: req.file.mimetype,
          imageBuffer: new Buffer(encode_image, "base64")
        };

      saveToLocal(decoded.id,token,finalImg,res);
      }

      // next(user); // add this line
    });
  }


  });


});



//ROUTES WILL GO HERE
app.get("/api/upload", async function(req, res) {
  res.sendFile(__dirname + "/imageUploads.html");
});


app.get("/api/photos/:id",  (req, res) => {
  var filename = req.params.id;
  //find user by id
  var query = { _id: ObjectId(filename) };

  Image.findOne(query,function(err, result) {
    if (err) return console.log(err);
    res.contentType("image/jpeg");
    console.log(result);
    res.send(result.image.imageBuffer.buffer);
  });
});


app.get("/api/photos", async function(req, res)  {

  Image.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);
  });
});




function getOutput(res,code,content,status,msg){
  meta['message'] = msg;
  meta['status'] = status;
  var data = {};

  data[globalResultParam] = content;
  output['data'] = data;
 return  res.status(code).send(output);
}

// saveImage to DB
function saveToLocal(id,token,imageObj,res){
 // create a new user called chris
 var imageModel = new Image({
   image:imageObj,
   token:token,
 });

 // call the built-in save method to save to the database
 imageModel.save(function(err,newImage) {
   globalResultParam = "imageUploadResult";
   loginResContent = {};

   if (err) {
     console.log(`Error : ${err}`);
     msg = 'There was a problem saving image.';
     return getOutput(res,200,loginResContent,status,msg);

   }
   console.log('image saved successfully!');

   status = true;
   msg = 'saved successfully!';

     loginResContent['message'] = msg;
     loginResContent['id'] = newImage._id;

     loginResContent['server'] =   'http://'+ip.address()+':'+fullUrl;
     loginResContent['imageUrl'] = loginResContent['server'] +'/api/photos/'+newImage._id;
     User.update({_id: id}, {
         image: loginResContent['imageUrl'],
     }, function(err, affected, resp) {
        console.log(resp);
     })


   return getOutput(res,200,loginResContent,status,msg);

 });
}
