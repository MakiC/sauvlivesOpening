const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db'); // Ensure this path is correct

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve patient detail page
app.get('/patient.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'patient.html'));
});

// Endpoint to save patient data
app.post('/api/patients', (req, res) => {
    const patient = req.body;
    const { firstName, lastName, email, dateOfBirth, contactInformation, diagnostic } = patient;

    // Insert into user table
    const userQuery = 'INSERT INTO user (email, role, first_name, last_name) VALUES (?, ?, ?, ?)';
    db.query(userQuery, [email, 'patient', firstName, lastName], (err, userResult) => {
        if (err) {
            console.error('Error saving user data:', err);
            return res.status(500).send('Error saving user data.');
        }

        const userId = userResult.insertId;

        // Insert into patient table
        const patientQuery = 'INSERT INTO patient (user_id, date_of_birth, contact_information, diagnostic) VALUES (?, ?, ?, ?)';
        db.query(patientQuery, [userId, dateOfBirth, contactInformation, diagnostic], (err, patientResult) => {
            if (err) {
                console.error('Error saving patient data:', err);
                return res.status(500).send('Error saving patient data.');
            }

            res.status(201).send('Patient saved.');
        });
    });
});

// Endpoint to retrieve patient data
app.get('/api/patients', (req, res) => {
    const query = `
        SELECT 
            user.id AS user_id,
            user.email,
            user.first_name,
            user.last_name,
            patient.date_of_birth,
            patient.contact_information,
            patient.diagnostic
        FROM 
            patient
        INNER JOIN 
            user 
        ON 
            patient.user_id = user.id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving patient data:', err);
            return res.status(500).send('Error retrieving patient data.');
        }
        res.json(results);
    });
});

// Endpoint to retrieve a specific patient's details
app.get('/api/patient/:id', (req, res) => {
    const patientId = req.params.id;
    const query = `
        SELECT 
            user.email,
            user.first_name,
            user.last_name,
            patient.date_of_birth,
            patient.contact_information,
            patient.diagnostic
        FROM 
            patient
        INNER JOIN 
            user 
        ON 
            patient.user_id = user.id
        WHERE 
            user.id = ?
    `;
    db.query(query, [patientId], (err, results) => {
        if (err) {
            console.error('Error retrieving patient details:', err);
            return res.status(500).send('Error retrieving patient details.');
        }
        res.json(results[0]);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
