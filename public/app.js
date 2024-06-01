const CACHE_NAME = 'hospital-pwa-cache-v3'; 
document.addEventListener('DOMContentLoaded', function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(() => {
            console.log('Service Worker Registered');
        });
    }

    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', function (e) {
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
    }

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
                deleteCacheEntry(`/api/patient/${patient.id}`); // Invalidate cache
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
        let patientsInitial = JSON.parse(localStorage.getItem('patients')) || [];
        if (patientsInitial.length > 0) {
			let patients=Object.assign({},patientsInitial);
            patients.forEach(patient => {
                saveToServer(patient);
            });
            localStorage.removeItem('patients');
        }
    }

    // Only fetch and display patients if the patient list element exists
    const patientList = document.getElementById('patientList');
    if (patientList) {
        fetchPatients(); // Fetch and display patients when the page loads
    }

    function fetchPatients() {
        fetch('/api/patients')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched patients:', data); // Log fetched data
                displayPatients(data);
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
            });
    }

    function displayPatients(data) {
        const patientList = document.getElementById('patientList');
        if (!patientList) return;

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
                        <button onclick="viewPatient(${patient.user_id})">View</button>
                    </div>
                </td>
            `;
            tbody.appendChild(patientRow);
        });

        console.log('Displayed patients:', data); // Log displayed data

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

    // Ensure viewPatient is globally accessible
    window.viewPatient = function (id) {
        // Fetch patient details from server and update cache
			window.location.href = `/patient.html?id=${id}`;
    };

    function deleteCacheEntry(url) {
        caches.open(CACHE_NAME).then(cache => {
            cache.delete(url);
        });
    }
});
