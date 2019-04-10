var app = require('./app.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config.js');
var Book = require('./Book');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var createBook = async function (req, res) {
  // Validate request
     if(!req.body.name) {
         return res.status(400).send({
             message: "Book name can not be empty!"
         });
     }
  var name = req.body.name;
  var author = req.body.author;
  var genre = req.body.genre;
  var releasedDate = req.body.releasedDate;

  console.log('body :'+ req.body);

// create a new user called chris
var book = new Book({
  bookName: name,
  author:author ,
  releasedDate:releasedDate ,
  genre:genre ,
});

// call the built-in save method to save to the database
book.save(function(err,book) {
  if (err) {
    console.log(`Error : ${err}`);
    return res.status(500).send("There was a problem registering the book.")
  }
  console.log('book saved successfully!');

  res.status(200).send({ status: true, msg: 'book created',book:book._id });
});

};



var book_details = async function (req, res) {
    fetchBook(req.params.bookId, function (err, product) {
        if (err) {
          console.log("No user matching user  ");
          return res.status(500).send({ status: false, message: 'There was a problem finding the book.' });
        }
        return res(null,res.status(200).send({ status: true, product: product }));
    })
};

var fetchBook = async function(id, callback){
  Book.findById(id, function (err, result) {
    if (err) {
      console.log("No user matching user  ");
      return callback(new Error( 'No user matching '   + id ));
     }else {
      //return res(null,res.status(200).send({ status: true, product: product }));
       return callback(null, result);
     }

  })
}

var deleteBook = async function(id, callback){
  fetchBook(id, function (err, product) {
      if (err) {
          return callback(new Error( 'No  matching books '   + id ));
      }else {
        Book.deleteOne({_id:id}, function (err) {
          if (err) {
            console.log("No  matching books  ");
            return callback(new Error( 'No  matching books '   + id ));
           }else {
            console.log("deleteOne book done  ");
             return callback(null,{
                message: 'Book Deleted' });
           }

        })
      }

  });


}

exports.book_details = book_details


var updateBook = async function (req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  }
})
  var conditions = { _id: req.params.bookId }
  , update = {   bookName: req.body.name || "Untitled Note",
                author: req.body.author ,
                  genre: req.body.genre
              }
  , options = { new: true };

  Book.updateOne(conditions, update, options,  function (err, product) {
      if (err) {
        console.log("No  matching books  ");
        return res.status(500).send({ status: false, message: 'There was a problem finding the book.' });
      }

      fetchBook(req.params.bookId, function (err, product) {
          if (err) {
            console.log("No user matching user  ");
            res.status(500).send({ status: false, message: 'There was a problem finding the book.' });
          }
          res.status(200).send({ status: true,  message: 'Book updated ',book: product });
      });
    })

  }

// Create and Save a new Note
exports.create = createBook

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {

};

// Find a single note with a noteId
exports.findOne = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.update = updateBook

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  deleteBook(req.params.bookId, function (err) {
      if (err) {
        return res.status(500).send({ status: false, message: 'There was a problem deleting the book.' });
      }
      res.status(200).send({ status: true,  message: 'Book deleted !!' });
  });
};
