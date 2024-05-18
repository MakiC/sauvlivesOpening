document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const patientId = params.get('id');

    const form = document.getElementById('editDiagnosticForm');

    // Fetch the current diagnostic to populate the form
    fetch(`/api/patient/${patientId}`)
        .then(response => response.json())
        .then(patient => {
            document.getElementById('diagnostic').value = patient.diagnostic;
        })
        .catch(error => {
            console.error('Error fetching patient details:', error);
        });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const diagnostic = document.getElementById('diagnostic').value;

        fetch(`/api/patient/${patientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ diagnostic })
        }).then(response => {
            if (response.ok) {
                console.log('Diagnostic updated.');
                window.location.href = `/patient.html?id=${patientId}`;
            }
        }).catch(error => {
            console.error('Error updating diagnostic:', error);
        });
    });
});
