// Initialisation du stockage local pour les questionnaires et leurs questions
let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];

document.getElementById('form-creation').addEventListener('submit', function(event) {
    event.preventDefault();

    const questionnaireName = document.getElementById('questionnaire-name').value;
    const questionText = document.getElementById('question-text').value;
    const responsesList = document.getElementById('responses-list').value.split(',').map(res => res.trim()).filter(res => res !== "");

    if (questionnaireName && questionText && responsesList.length > 0) {
        const existingQuestionnaire = questionnaires.find(q => q.name === questionnaireName);

        if (existingQuestionnaire) {
            // Ajouter la question au questionnaire existant
            existingQuestionnaire.questions.push({ question: questionText, options: responsesList });
        } else {
            // Créer un nouveau questionnaire
            const newQuestionnaire = {
                name: questionnaireName,
                questions: [{ question: questionText, options: responsesList }]
            };
            questionnaires.push(newQuestionnaire);
        }

        // Sauvegarder dans le localStorage
        localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
        displayQuestionnaires();
    }
});

function displayQuestionnaires() {
    const questionnairesList = document.getElementById('questionnaires-list');
    questionnairesList.innerHTML = ''; // Réinitialiser la liste affichée

    questionnaires.forEach((q, index) => {
        const div = document.createElement('div');
        div.classList.add('questionnaire');
        
        const header = document.createElement('h3');
        header.textContent = `Questionnaire : ${q.name}`;
        div.appendChild(header);

        const questionList = document.createElement('ul');
        q.questions.forEach((question, qIndex) => {
            const li = document.createElement('li');
            li.textContent = `${question.question} - Options: ${question.options.join(', ')}`;
            questionList.appendChild(li);
        });

        div.appendChild(questionList);

        // Lien pour répondre au questionnaire
        const link = document.createElement('a');
        const encodedData = btoa(JSON.stringify(q.questions)); // Encode les questions en Base64
        link.href = `${window.location.origin}/repondre.html?questionnaireId=${encodedData}&questionIndex=0`;
        link.textContent = 'Répondre à ce questionnaire';
        div.appendChild(link);

        // Ajouter l'option de modification
        const editLink = document.createElement('a');
        editLink.href = "#";
        editLink.textContent = 'Modifier ce questionnaire';
        editLink.addEventListener('click', function() {
            editQuestionnaire(index);
        });
        div.appendChild(editLink);

        questionnairesList.appendChild(div);
    });

    // Générer un lien pour chaque questionnaire
    const linkDiv = document.getElementById('generated-links');
    linkDiv.innerHTML = '';
    questionnaires.forEach(q => {
        const link = document.createElement('a');
        const encodedData = btoa(JSON.stringify(q.questions));
        link.href = `${window.location.origin}/repondre.html?questionnaireId=${encodedData}&questionIndex=0`;
        link.textContent = `Lien pour le questionnaire ${q.name}`;
        linkDiv.appendChild(link);
        linkDiv.appendChild(document.createElement('br'));
    });
}

// Fonction de modification des questions dans un questionnaire
function editQuestionnaire(index) {
    const questionnaire = questionnaires[index];
    const newQuestionText = prompt("Entrez la nouvelle question");
    const newResponses = prompt("Entrez les nouvelles réponses possibles (séparées par des virgules)");

    if (newQuestionText && newResponses) {
        const updatedQuestion = {
            question: newQuestionText,
            options: newResponses.split(',').map(res => res.trim())
        };

        // Modifier la première question dans cet exemple (peut être étendu pour toute question)
        questionnaire.questions[0] = updatedQuestion;

        localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
        displayQuestionnaires();
    }
}

// Initialiser l'affichage des questionnaires existants
displayQuestionnaires();
