let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];

// Fonction pour afficher tous les questionnaires créés
function displayQuestionnaires() {
    const list = document.getElementById('questionnaires-list');
    list.innerHTML = '';

    questionnaires.forEach((q) => {
        const link = `${window.location.origin}/repondre.html?name=${encodeURIComponent(q.name)}`;
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${q.name}</h3>
            <p>Questions : ${q.questions.map((question) => question.question).join(', ')}</p>
            <p><a href="${link}" target="_blank">Lien pour répondre</a></p>
        `;
        list.appendChild(div);
    });
}

// Fonction pour ajouter une question à un questionnaire
document.getElementById('form-creation').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('questionnaire-name').value.trim();
    const questionText = document.getElementById('question-text').value.trim();
    const responses = document
        .getElementById('responses-list')
        .value.split(',')
        .map((r) => r.trim());

    if (!name || !questionText || responses.length === 0) {
        alert('Veuillez remplir tous les champs.');
        return;
    }

    // Trouver ou créer un questionnaire
    let questionnaire = questionnaires.find((q) => q.name === name);
    if (!questionnaire) {
        questionnaire = { name, questions: [] };
        questionnaires.push(questionnaire);
    }

    // Ajouter la question au questionnaire
    questionnaire.questions.push({ question: questionText, responses });

    // Sauvegarder dans localStorage
    localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
    alert('Question ajoutée avec succès !');

    // Réinitialiser le formulaire
    document.getElementById('form-creation').reset();
    displayQuestionnaires();
});

// Afficher les questionnaires au chargement de la page
displayQuestionnaires();
