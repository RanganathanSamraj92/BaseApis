var app = require("./app.js");
const multer = require("multer");
var fs = require("fs");
var User = require('./User');
var ObjectId = require("mongodb").ObjectID;

const MongoDB = require("./mongodb.js");
const db = MongoDB.getDB();

MongoDB.connectDB(async err => {
  if (err) {
    console.log("Not Conncted..");
  } else {
    console.log("Conncted..!");
  }
});


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
  var img = fs.readFileSync(req.file.path);
  var encode_image = img.toString("base64");
  // Define a JSONobject for the image attributes for saving to database

  var finalImg = {
    contentType: req.file.mimetype,
    image: new Buffer(encode_image, "base64")
  };

saveToLocal(finalImg,res);
  //
  // saveImage(finalImg, "", function(err, result) {
  //   if (!err) {
  //     console.log("saved on disk!");
  //     console.log(finalImg);
  //     jsonText = {
  //       meta: { status: true, statusCode: 200, msg: `saved on disk` },
  //       results: {}
  //     };
  //     res.send(JSON.stringify(jsonText));
  //     res.end();
  //   } else {
  //     console.log("saved failed");
  //     console.log(finalImg);
  //     jsonText = {
  //       meta: { status: false, statusCode: 200, msg: `saved failed` },
  //       results: {}
  //     };
  //     res.send(JSON.stringify(jsonText));
  //     res.end();
  //   }
  // });
});



//ROUTES WILL GO HERE
app.get("/api/upload", async function(req, res) {
  res.sendFile(__dirname + "/imageUploads.html");
});

app.get("/api/photo/:id", (req, res) => {
  var filename = req.params.id;
  const db = MongoDB.getDB();
  db.collection("quotes").findOne(
    { _id: ObjectId(filename) },
    (err, result) => {
      if (err) return console.log(err);

      res.contentType("image/jpeg");
      res.send(result.image.buffer);
    }
  );
});

app.get("/api/photos", (req, res) => {
  const db = MongoDB.getDB();
  db.collection("quotes")
    .find()
    .toArray((err, result) => {
      const imgArray = result.map(element => element._id);
      console.log(imgArray);

      if (err) return console.log(err);
      res.send(imgArray);
    });
});


// saveImage to DB
const saveImage = async function(finalImg, email, callback) {
  const db = MongoDB.getDB();
  const users = db.createCollection("quotes", function(err, res) {
    if (err) {
      return callback(new Error("canot create quotes collection " + name));
    }
    console.log("quotes - Collection created!");
    db.collection("quotes").insertOne(finalImg, function(err, res) {
      if (err) throw err;
      console.log("1 quote inserted");
      return callback(null, "quotes inserted sucessfully!!");
    });
  });
};

function getOutput(res,code,content,status,msg){
  meta['message'] = msg;
  meta['status'] = status;
  var data = {};

  data[globalResultParam] = content;
  output['data'] = data;
 return  res.status(code).send(output);
}

function saveToLocal(image,res){
 // create a new user called chris
 var user = new User({
   name: 'ranganathan',
   email:'ranganathan272@gmail.com' ,
   password: 'ABCD123',
   image:image ,
   mobile:'9988776655' ,
 });

 // call the built-in save method to save to the database
 user.save(function(err) {
   globalResultParam = "result";
   loginResContent = {};

   if (err) {
     console.log(`Error : ${err}`);
     msg = 'There was a problem registering the user.';
     return getOutput(res,200,loginResContent,status,msg);

   }
   console.log('User saved successfully!');
   console.log(`create :create a token`);

   status = true;
   msg = 'completed!';

     loginResContent['message'] = msg;

   return getOutput(res,200,loginResContent,status,msg);

 });
}
