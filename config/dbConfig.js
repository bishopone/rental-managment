const mysql = require('mysql2');

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'room_managment', 
});

module.exports = db;