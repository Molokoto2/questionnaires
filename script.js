let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];

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

document.getElementById('generate-link').addEventListener('click', function() {
    const questionnaireId = btoa(JSON.stringify(questionnaires)); // Encodage Base64 de l'objet questionnaire
    const uniqueLink = `${window.location.origin}/repondre.html?questionnaireId=${questionnaireId}&questionIndex=0`;
    document.getElementById('link-to-share').innerHTML = `<p>Voici le lien pour partager le questionnaire : <a href="${uniqueLink}" target="_blank">${uniqueLink}</a></p>`;
});

// Afficher les résultats (optionnel sur la page de création)
function displayResults() {
    const resultsSummary = document.getElementById('results-summary');
    resultsSummary.innerHTML = `<h3>Total de réponses : ${responses.length}</h3>`;
    // Vous pouvez ajouter ici un tableau ou un graphique des résultats.
}

// Initialiser l'affichage des questions
displayQuestions();
