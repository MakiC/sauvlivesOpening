const mysql = require('mysql2');
const retry = require('async-retry');

const connectToDatabase = async () => {
  let connection;
  await retry(async () => {
    connection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',   // MySQL host
      user: process.env.DB_USER || 'root',        // MySQL user
      password: process.env.DB_PASSWORD || '',    // MySQL password
      database: process.env.DB_NAME || 'mydatabase' // MySQL database name
    });

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        throw err;
      }
      console.log('Connected to the MySQL database.');
    });
  }, {
    retries: 5,
    minTimeout: 2000
  });
  return connection;
};

module.exports = connectToDatabase;
