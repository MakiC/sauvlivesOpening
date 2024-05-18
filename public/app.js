document.getElementById('patientForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const patientName = document.getElementById('patientName').value;
    const patientLastName = document.getElementById('patientLastName').value;
    const patientEmail = document.getElementById('patientEmail').value;
    const patientDOB = document.getElementById('patientDOB').value;
    const patientContact = document.getElementById('patientContact').value;

	
    console.log("Form Data: ", {patientName, patientLastName, patientEmail, patientPassword, patientDOB, patientContact, diagnostic});

    const patient = {
        firstName: patientName,
        lastName: patientLastName,
        email: patientEmail,
        dateOfBirth: patientDOB,
        contactInformation: patientContact,
    };

    if (navigator.onLine) {
        saveToServer(patient);
    } else {
        saveToLocalStorage(patient);
    }
});

function saveToServer(patient) {
	console.log("Saving to server: ", patient);
    fetch('/api/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    }).then(response => {
        if (response.ok) {
            console.log('Patient saved to server.');
            fetchPatients(); // Refresh the patient list
        }
    }).catch((err) => {
		console.error('Error saving to server: ', err);
        saveToLocalStorage(patient);
    });
}

function saveToLocalStorage(patient) {
	console.log("Saving to local storage: ", patient);
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
    console.log('Patient saved to LocalStorage.');
}

window.addEventListener('online', syncWithServer);

function syncWithServer() {
    let patients = JSON.parse(localStorage.getItem('patients')) || [];
    if (patients.length > 0) {
        patients.forEach(patient => {
            saveToServer(patient);
        });
        localStorage.removeItem('patients');
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => {
            console.log('Service Worker Registered');
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchPatients(); // Fetch and display patients when the page loads
});

function fetchPatients() {
    fetch('/api/patients')
        .then(response => response.json())
        .then(data => {
            const patientList = document.getElementById('patientList');
            patientList.innerHTML = '';

            data.forEach(patient => {
                const patientItem = document.createElement('div');
                patientItem.classList.add('patient-item');
                patientItem.innerHTML = `
                    <p><strong>Name:</strong> ${patient.first_name} ${patient.last_name}</p>
                    <p><strong>Date of Birth:</strong> ${patient.date_of_birth}</p>
					<p><strong>Email:</strong> ${patient.email}</p>
                    <p><strong>Contact Information:</strong> ${patient.contact_information}</p>
                `;
				   patientItem.addEventListener('click', () => {
                    window.location.href = `/patient.html?id=${patient.user_id}`;
                });
                patientList.appendChild(patientItem);
            });
        })
        .catch(error => {
            console.error('Error fetching patients:', error);
        });
}
