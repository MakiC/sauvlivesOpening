document.getElementById('patientForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const patientName = document.getElementById('patientName').value;
    const patientLastName = document.getElementById('patientLastName').value;
    const patientEmail = document.getElementById('patientEmail').value;
    const patientDOB = document.getElementById('patientDOB').value;
    const patientContact = document.getElementById('patientContact').value;
    const diagnostic = document.getElementById('diagnostic').value;

    const patient = {
        firstName: patientName,
        lastName: patientLastName,
        email: patientEmail,
        dateOfBirth: patientDOB,
        contactInformation: patientContact,
        diagnostic: diagnostic
    };

    if (navigator.onLine) {
        saveToServer(patient);
    } else {
        saveToLocalStorage(patient);
    }
});

function saveToServer(patient) {
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
    }).catch(() => {
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
            displayPatients(data);
        })
        .catch(error => {
            console.error('Error fetching patients:', error);
        });
}

function displayPatients(data) {
    const patientList = document.getElementById('patientList');
    patientList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th class="sortable" data-sort="first_name">First Name</th>
                    <th class="sortable" data-sort="last_name">Last Name</th>
                    <th>Date of Birth</th>
                    <th>Contact Information</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    `;

    const tbody = patientList.querySelector('tbody');
    data.forEach(patient => {
        const patientRow = document.createElement('tr');
        patientRow.innerHTML = `
            <td>${patient.first_name}</td>
            <td>${patient.last_name}</td>
            <td>${patient.date_of_birth}</td>
            <td>${patient.contact_information}</td>
            <td>${patient.email}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="window.location.href='/patient.html?id=${patient.user_id}'">View</button>
                    <button onclick="window.location.href='/edit-diagnostic.html?id=${patient.user_id}'">Edit Diagnostic</button>
                </div>
            </td>
        `;
        tbody.appendChild(patientRow);
    });

    // Add sorting functionality
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const sortBy = header.getAttribute('data-sort');
            const sortedData = sortData(data, sortBy, header.classList.contains('sort-asc'));
            header.classList.toggle('sort-asc', !header.classList.contains('sort-asc'));
            displayPatients(sortedData);
        });
    });
}

function sortData(data, key, asc) {
    return data.sort((a, b) => {
        if (a[key] < b[key]) return asc ? -1 : 1;
        if (a[key] > b[key]) return asc ? 1 : -1;
        return 0;
    });
}
