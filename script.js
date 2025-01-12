// Exemple de questions à afficher dans le questionnaire
const questions = [
    { type: 'text', question: "Quel est votre nom?" },
    { type: 'radio', question: "Quel est votre âge?", options: ["Moins de 18", "18-30", "31-50", "Plus de 50"] },
    { type: 'checkbox', question: "Quels sports pratiquez-vous?", options: ["Football", "Basketball", "Natation", "Cyclisme"] },
    { type: 'text', question: "Où habitez-vous?" }
];

// Fonction pour afficher le questionnaire
function displayQuestionnaire() {
    const form = document.getElementById('questionnaire-form');
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.classList.add('question');

        const label = document.createElement('label');
        label.textContent = q.question;
        div.appendChild(label);

        if (q.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `question-${index}`;
            div.appendChild(input);
        } else if (q.type === 'radio') {
            q.options.forEach((option, i) => {
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = `question-${index}`;
                input.value = option;
                const label = document.createElement('label');
                label.textContent = option;
                div.appendChild(input);
                div.appendChild(label);
            });
        } else if (q.type === 'checkbox') {
            q.options.forEach((option, i) => {
                const input = document.createElement('input');
                input.type = 'checkbox';
                input.name = `question-${index}`;
                input.value = option;
                const label = document.createElement('label');
                label.textContent = option;
                div.appendChild(input);
                div.appendChild(label);
            });
        }

        form.appendChild(div);
    });
}

// Fonction pour soumettre les réponses
document.getElementById('questionnaire-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const responses = [];
    let isValid = true;
    const validationMessage = document.getElementById('validation-message');
    validationMessage.textContent = '';  // Réinitialiser le message de validation

    questions.forEach((q, index) => {
        const elements = document.getElementsByName(`question-${index}`);
        let answer = '';

        if (q.type === 'text') {
            answer = elements[0].value;
            if (!answer) {
                isValid = false;
                validationMessage.textContent = 'Veuillez répondre à toutes les questions.';
            }
        } else if (q.type === 'radio') {
            elements.forEach(element => {
                if (element.checked) {
                    answer = element.value;
                }
            });
            if (!answer) {
                isValid = false;
                validationMessage.textContent = 'Veuillez répondre à toutes les questions.';
            }
        } else if (q.type === 'checkbox') {
            elements.forEach(element => {
                if (element.checked) {
                    answer += (answer ? ', ' : '') + element.value;
                }
            });
            if (!answer) {
                isValid = false;
                validationMessage.textContent = 'Veuillez répondre à toutes les questions.';
            }
        }

        responses.push(answer);
    });

    if (isValid) {
        // Ajouter la réponse dans le tableau des résultats
        const resultsTable = document.getElementById('results-table').getElementsByTagName('tbody')[0];
        const newRow = resultsTable.insertRow();
        responses.forEach(response => {
            const cell = newRow.insertCell();
            cell.textContent = response || "Aucune réponse";
        });

        // Ajouter le temps de soumission
        const cell = newRow.insertCell();
        cell.textContent = new Date().toLocaleString();

        // Stocker les réponses dans le localStorage (pour simplification ici)
        let storedResponses = JSON.parse(localStorage.getItem('responses')) || [];
        storedResponses.push({ responses, timestamp: new Date().toLocaleString() });
        localStorage.setItem('responses', JSON.stringify(storedResponses));

        // Mettre à jour le graphique
        updateChart(storedResponses);
    }
});

// Fonction pour mettre à jour le graphique des réponses
function updateChart(responses) {
    const responseCounts = {};

    responses.forEach(response => {
        response.responses.forEach(answer => {
            responseCounts[answer] = (responseCounts[answer] || 0) + 1;
        });
    });

    const chartData = {
        labels: Object.keys(responseCounts),
        datasets: [{
            label: 'Fréquence des réponses',
            data: Object.values(responseCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const ctx = document.getElementById('response-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Afficher le questionnaire à l'ouverture de la page
displayQuestionnaire();

// Charger les réponses existantes du localStorage et afficher le graphique
window.onload = function() {
    const storedResponses = JSON.parse(localStorage.getItem('responses')) || [];
    updateChart(storedResponses);
};
