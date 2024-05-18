const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',   // Update with your MySQL host
    user: 'openingDayApp',        // Update with your MySQL user
    password: 'Dff600%$', // Update with your MySQL password
    database: 'booking_app_db' // Update with your MySQL database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = connection;

