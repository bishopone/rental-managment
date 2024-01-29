const mysql = require('mysql2');

// const db = mysql.createConnection({
//   user: 'root',
//   host: 'localhost',
//   password: '',
//   database: 'room_managment', 
// });
const db = mysql.createConnection({
  host: "localhost",
  user: "aboldefo_abol",
  password: "7K7js{$[TUHf",
  database: 'aboldefo_room_managment', 
});

module.exports = db;