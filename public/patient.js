document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get('id');

    if (patientId) {
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
                    <p><strong>Diagnostic:</strong> ${patient.diagnostic}</p>
                `;
            })
            .catch(error => {
                console.error('Error fetching patient details:', error);
            });
    }
});
