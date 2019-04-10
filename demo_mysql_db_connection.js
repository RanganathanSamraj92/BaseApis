var mysql = require('mysql');
//var log = require('./log.js');

const con = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'socka'
});

con.connect(function(err) {
  if (err) {
   console.error('error connecting: ' + err.stack);
   return;
 }
  console.log("Connected!");
});
