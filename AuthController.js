var app = require('./app.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config.js');
var User = require('./User');
var Image = require('./Image');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var globalResultParam = "Value";
var output = {};
var meta = {};

var status = false;
var msg = "we are sorry! could not generate response!"
meta['status'] = status;
meta['message'] = msg;

output['meta'] = meta;


app.post('/auth/register', async function(req, res) {
  globalResultParam = "result";
  loginResContent = {};
  msg = 'There was a problem ';
  status = false;

  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var image = req.body.image;
  var mobile = req.body.mobile;
  console.log(`body : ${req.body}`);
  console.log(`body password" ${password}`);
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  console.log(`body hashedPassword: ${hashedPassword}`);

  // create a new user called chris
  var user = new User({
    name: name,
    email: email,
    password: hashedPassword,
    image: image,
    mobile: mobile,
  });

  // call the built-in save method to save to the database
  user.save(function(err) {
    if (err) {
      console.log(`Error : ${err}`);
      msg = 'There was a problem registering the user.';
      loginResContent['token'] = token;
      return getOutput(res, 200, loginResContent, status, msg);

    }
    console.log('User saved successfully!');
    console.log(`create :create a token`);
    var token = jwt.sign({
      id: user._id
    }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    console.log(`token created :${token}`);
    status = true;
    msg = 'Registration completed!';

    loginResContent['token'] = token;
    loginResContent['message'] = msg;

    return getOutput(res, 200, loginResContent, status, msg);

  });


});

app.post('/auth/login', async function(req, res) {
  globalResultParam = "result";
  loginResContent = {};
  msg = 'There was a problem ';
  status = false;
  try {
    var email = req.body.email;
    var password = req.body.password;

    console.log(`body email: ${email}`);
    console.log(`body password" ${password}`);

  let job = await workQueue.add();
  var delayed = new DelayedResponse(req, res);
  delayed.on('done', function (results) {
    // slowFunction responded within 5 seconds
    msg = 'slowFunction responded within 5 seconds!';
    return getOutput(res, 200, loginResContent, status, msg);
  }).on('cancel', function () {
    // slowFunction failed to invoke its callback within 5 seconds
    // response has been set to HTTP 202
   // res.write('sorry, this will take longer than expected...');
   msg = 'orry, this will take longer than expected...';
    return getOutput(res, 200, loginResContent, status, msg);
  });



    if (email == null || email == 'undefined') {
      msg = 'email is missing!';
      return getOutput(res, 200, loginResContent, status, msg);
    } else if (password == null || password == 'undefined') {
      loginResContent = {
        auth: false,
        message: 'password is missing! '
      };
      return getOutput(res, 200, loginResContent, status, msg);
    } else {
      var hashedPassword = bcrypt.hashSync(password, 8);
      console.log(`body hashedPassword: ${hashedPassword}`);
    }

  } catch (error) {
    return getOutput(res, 200, loginResContent, status, msg);
  }


  //find user by id
  var query = {
    email: email
  };
  let cursor = await User.findOne(query, function(err, user) {
    if (err) {
      console.log("No user matching user  ");
      msg = 'There was a problem finding the user.';
      getOutput(res, 200, loginResContent, status, msg);
    } else if (!user) {
      msg = 'No user found.';
      getOutput(res, 200, loginResContent, status, msg);
    } else {
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        msg = 'invalid password.';
        return getOutput(res, 200, loginResContent, status, msg);

      }
      console.log("matching user! " + user);
      console.log(`create :create a token`);
      var token = jwt.sign({
        id: user._id
      }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      console.log(`token created :${token}`);
      status = true;
      msg = 'Authentication success!'
      loginResContent['token'] = token;
      return getOutput(res, 200, loginResContent, status, msg);


    }
  });
});



function getOutput(res, code, content, status, msg) {
  meta['message'] = msg;
  meta['status'] = status;
  var data = {};

  data[globalResultParam] = content;
  output['data'] = data;
  return res.status(code).send(output);
}



app.get('/auth/me', function(req, res) {
  globalResultParam = "user_info";
  status = false;
  msg = 'There was a problem';
  var profileResContent = {};
  var token = req.headers['x-access-token'];
  if (!token) {
    msg = 'No token provided.';
    return getOutput(res, 200, profileResContent, status, msg);
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      msg = 'Failed to authenticate token.';
      return getOutput(res, 200, profileResContent, status, msg);
    }
    //find user by id
    User.findById(decoded.id, function(err, user) {
      if (err) {

        msg = 'Cant find user pls try again!';
        console.log(msg);
        return getOutput(res, 200, profileResContent, status, msg);
      }
      if (!user) {
        msg = 'No user found';
        console.log(msg);
        return getOutput(res, 200, profileResContent, status, msg);
      } else {
        status = true;
        msg = 'user found for this token ';
        console.log(msg);
        profileResContent = user;
        getOutput(res, 200, profileResContent, status, msg);
      }
    });
  });
});
