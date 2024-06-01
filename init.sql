#BookingApp Database

#CREATE DATABASE booking_app_db;
USE booking_app_db;
#Users table: This table will store common information for doctors, secretaries, and patients.

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('doctor', 'secretary', 'patient','super_admin') NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);


#Doctors table: This table will store information specific to doctors, with a foreign key referencing the users table.

CREATE TABLE doctor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);


#Patients table: This table will store information specific to patients, with a foreign key referencing the users table.

CREATE TABLE patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    contact_information VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
);


#Appointments table: This table will store appointment information.

CREATE TABLE appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);


#Prescriptions table: This table will store prescription information related to appointments.
CREATE TABLE prescription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    medication VARCHAR(255) NOT NULL,
    dosage VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL,
    instructions TEXT,
    FOREIGN KEY (appointment_id) REFERENCES appointment(id)
);


#Educational_Content table: This table will store information about various healthcare-related resources.

CREATE TABLE educational_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('article', 'video', 'infographic', 'other') NOT NULL,
    content_url VARCHAR(2083) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    date_published DATE NOT NULL,
    tags VARCHAR(255)
);
