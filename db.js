const mysql = require('mysql');
const url = require('url');

const dbUrl = process.env.JAWSDB_URL || 'mysql://root:test@localhost:3306/openingDayAppDb';
const params = url.parse(dbUrl);
const [username, password] = params.auth.split(':');

const connection = mysql.createConnection({
  host: params.hostname,
  port: params.port,
  user: username,
  password: password,
  database: params.pathname.split('/')[1]
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection;
