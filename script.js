// Stockage des données (simulé avec localStorage)
let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
let responses = JSON.parse(localStorage.getItem('responses')) || [];

// Créer une question avec plusieurs réponses possibles
document.getElementById('form-creation').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const questionText = document.getElementById('question-text').value;
    const responsesList = document.getElementById('responses-list').value.split(',').map(res => res.trim()).filter(res => res !== "");
    
    if (questionText && responsesList.length > 0) {
        const newQuestion = {
            question: questionText,
            options: responsesList
        };
        questionnaires.push(newQuestion);
        localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
        displayQuestions();
    }
});

// Afficher les questions dans la section "Création"
function displayQuestions() {
    const questionsList = document.getElementById('questions-list');
    questionsList.innerHTML = '';
    
    questionnaires.forEach((q, index) => {
        const div = document.createElement('div');
        div.classList.add('question');
        
        const label = document.createElement('label');
        label.textContent = q.question;
        div.appendChild(label);
        
        q.options.forEach((option, i) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${index}`;
            input.value = option;
            div.appendChild(input);
            div.appendChild(document.createTextNode(option));
            div.appendChild(document.createElement('br'));
        });
        
        questionsList.appendChild(div);
    });
}

// Générer un lien unique pour le questionnaire
document.getElementById('generate-link').addEventListener('click', function() {
    const questionnaireId = btoa(JSON.stringify(questionnaires)); // Encodage Base64 de l'objet questionnaire
    const uniqueLink = `${window.location.href}#repondre?questionnaireId=${questionnaireId}&questionIndex=0`;
    document.getElementById('link-to-share').innerHTML = `<p>Voici le lien pour partager le questionnaire : <a href="${uniqueLink}" target="_blank">${uniqueLink}</a></p>`;
});

// Afficher une seule question à la fois pour le répondant
document.getElementById('repondre').addEventListener('click', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionnaireId = urlParams.get('questionnaireId');
    const questionIndex = parseInt(urlParams.get('questionIndex'), 10);
    
    if (questionnaireId) {
        const decodedQuestionnaire = JSON.parse(atob(questionnaireId));
        const questionnaireToAnswer = document.getElementById('questionnaire-to-answer');
        questionnaireToAnswer.innerHTML = '';

        const q = decodedQuestionnaire[questionIndex];
        const div = document.createElement('div');
        div.classList.add('question');
        
        const label = document.createElement('label');
        label.textContent = q.question;
        div.appendChild(label);
        
        q.options.forEach((option, i) => {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question-${questionIndex}`;
            input.value = option;
            div.appendChild(input);
            div.appendChild(document.createTextNode(option));
            div.appendChild(document.createElement('br'));
        });

        questionnaireToAnswer.appendChild(div);
    }
});

// Soumettre les réponses
document.getElementById('form-reponse').addEventListener('submit', function(event) {
    event.preventDefault();

    const responseData = [];
    const urlParams = new URLSearchParams(window.location.search);
    const questionnaireId = urlParams.get('questionnaireId');
    const questionIndex = parseInt(urlParams.get('questionIndex'), 10);
    
    if (questionnaireId) {
        const decodedQuestionnaire = JSON.parse(atob(questionnaireId));

        const elements = document.getElementsByName(`question-${questionIndex}`);
        let answer = '';
        elements.forEach(element => {
            if (element.checked) {
                answer = element.value;
            }
        });

        responseData.push(answer);
        responses.push(responseData);
        localStorage.setItem('responses', JSON.stringify(responses));

        // Passer à la question suivante (ou finir)
        const nextQuestionIndex = questionIndex + 1;
        if (nextQuestionIndex < decodedQuestionnaire.length) {
            const nextLink = `${window.location.href.split('?')[0]}#repondre?questionnaireId=${questionnaireId}&questionIndex=${nextQuestionIndex}`;
            window.location.href = nextLink;
        } else {
            alert('Merci pour vos réponses !');
            window.location.href = window.location.href.split('#')[0];
        }
    }
});

// Afficher les résultats
function displayResults() {
    const resultsSummary = document.getElementById('results-summary');
    const responsesTable = document.getElementById('responses-table').getElementsByTagName('tbody')[0];

    resultsSummary.innerHTML = `<h3>Total de réponses : ${responses.length}</h3>`;

    // Graphique de répartition des réponses
    const chartData = {};
    questionnaires.forEach((q, index) => {
        const answers = responses.map(response => response[index]);
        answers.forEach(answer => {
            chartData[answer] = (chartData[answer] || 0) + 1;
        });
    });

    const labels = Object.keys(chartData);
    const data = Object.values(chartData);
    
    const ctx = document.getElementById('response-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Réponses',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Afficher les réponses individuelles
    responses.forEach((response, respondentIndex) => {
        const row = responsesTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        cell1.textContent = `Répondant ${respondentIndex + 1}`;
        cell2.textContent = response.join(', ');
    });
}

// Afficher les résultats lorsque l'onglet "Résultats" est visible
document.getElementById('resultats').addEventListener('click', displayResults);

// Initialiser l'affichage des questions
displayQuestions();
