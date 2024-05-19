document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get('id');

    fetch(`/api/patient/${patientId}`)
        .then(response => response.json())
        .then(patient => {
            const patientDetails = document.getElementById('patientDetails');
            patientDetails.innerHTML = `
                <p><strong>First Name:</strong> ${patient.first_name}</p>
                <p><strong>Last Name:</strong> ${patient.last_name}</p>
                <p><strong>Date of Birth:</strong> ${patient.date_of_birth}</p>
                <p><strong>Email:</strong> ${patient.email}</p>
                <p><strong>Contact Information:</strong> ${patient.contact_information}</p>
                <p><strong>Diagnostic:</strong> <textarea id="diagnostic" readonly>${patient.diagnostic}</textarea></p>
                <button id="editButton">Edit</button>
                <button id="saveButton" style="display:none;">Save</button>
            `;

            const editButton = document.getElementById('editButton');
            const saveButton = document.getElementById('saveButton');
            const diagnosticField = document.getElementById('diagnostic');

            editButton.addEventListener('click', () => {
                diagnosticField.removeAttribute('readonly');
                editButton.style.display = 'none';
                saveButton.style.display = 'inline';
            });

            saveButton.addEventListener('click', () => {
                const updatedDiagnostic = diagnosticField.value;
                fetch(`/api/patient/${patientId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ diagnostic: updatedDiagnostic })
                }).then(response => {
                    if (response.ok) {
                        diagnosticField.setAttribute('readonly', 'readonly');
                        editButton.style.display = 'inline';
                        saveButton.style.display = 'none';
                    }
                }).catch(error => {
                    console.error('Error updating diagnostic:', error);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching patient details:', error);
        });
});
