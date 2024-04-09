const mysql = require('mysql2');

// const db = mysql.createConnection({
//   user: 'root',
//   host: 'localhost',
//   password: '',
//   database: 'room_managment',
//   namedPlaceholders: true
// });

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "royalbti_royalbti",
//   password: "neln3Jt}zc(V",
//   database: 'royalbti_room_managment',
//   namedPlaceholders: true
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "aboldefo_abol",
  password: "7K7js{$[TUHf",
  database: "aboldefo_room_managment", 
  namedPlaceholders: true
});

module.exports = db;