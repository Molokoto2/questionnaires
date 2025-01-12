// Stockage des données (simulé avec localStorage)
let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
let responses = JSON.parse(localStorage.getItem('responses')) || [];

// Créer une question
document.getElementById('form-creation').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const questionText = document.getElementById('question-text').value;
    const numberOfResponses = parseInt(document.getElementById('number-responses').value, 10);
    
    if (questionText && numberOfResponses > 0) {
        const newQuestion = {
            question: questionText,
            options: Array.from({ length: numberOfResponses }, (_, index) => `Réponse ${index + 1}`)
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

// Afficher le questionnaire dans l'onglet "Répondre"
document.getElementById('repondre').addEventListener('click', function() {
    const questionnaireToAnswer = document.getElementById('questionnaire-to-answer');
    questionnaireToAnswer.innerHTML = '';

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
        
        questionnaireToAnswer.appendChild(div);
    });
});

// Soumettre les réponses
document.getElementById('form-reponse').addEventListener('submit', function(event) {
    event.preventDefault();

    const responseData = [];

    questionnaires.forEach((q, index) => {
        const elements = document.getElementsByName(`question-${index}`);
        let answer = '';
        elements.forEach(element => {
            if (element.checked) {
                answer = element.value;
            }
        });
        responseData.push(answer);
    });

    responses.push(responseData);
    localStorage.setItem('responses', JSON.stringify(responses));

    alert('Réponses enregistrées !');
});

// Afficher les résultats
function displayResults() {
    const resultsSummary = document.getElementById('results-summary');
    const responsesTable = document.getElementById('responses-table').getElementsByTagName('tbody')[0];

    resultsSummary.innerHTML = `<h3>Total de réponses : ${responses.length}</h3>`;
    
    // Calcul des moyennes et du nombre de réponses par question
    questionnaires.forEach((q, index) => {
        const responseCount = responses.filter(response => response[index] !== '').length;
        const answers = responses.map(response => response[index]);
        const uniqueAnswers = [...new Set(answers)];
        const resultHtml = `<p><strong>${q.question}</strong><br>
                            Nombre de réponses : ${responseCount}<br>
                            Réponses uniques : ${uniqueAnswers.join(', ')}</p>`;
        resultsSummary.innerHTML += resultHtml;
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
