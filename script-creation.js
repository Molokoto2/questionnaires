let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
let currentQuestionnaire = null;

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

// Fonction pour commencer un nouveau questionnaire
document.getElementById('start-questionnaire').addEventListener('click', function () {
    const name = prompt('Nom du questionnaire :');
    if (!name) return alert('Le nom du questionnaire est obligatoire.');

    currentQuestionnaire = { name, questions: [] };
    alert(`Questionnaire "${name}" créé. Ajoutez maintenant des questions.`);
});

// Fonction pour ajouter une question au questionnaire en cours
document.getElementById('add-question').addEventListener('click', function () {
    if (!currentQuestionnaire) {
        return alert('Vous devez d\'abord créer un questionnaire.');
    }

    const questionText = prompt('Texte de la question :');
    const responses = prompt('Réponses possibles (séparées par une virgule) :').split(',').map((r) => r.trim());

    if (!questionText || responses.length === 0) {
        return alert('La question et les réponses sont obligatoires.');
    }

    currentQuestionnaire.questions.push({ question: questionText, responses });
    alert('Question ajoutée avec succès.');
});

// Fonction pour finaliser le questionnaire et le sauvegarder
document.getElementById('finalize-questionnaire').addEventListener('click', function () {
    if (!currentQuestionnaire) {
        return alert('Aucun questionnaire en cours.');
    }

    questionnaires.push(currentQuestionnaire);
    localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
    alert(`Questionnaire "${currentQuestionnaire.name}" finalisé et sauvegardé.`);

    currentQuestionnaire = null;
    displayQuestionnaires();
});

// Afficher les questionnaires au chargement de la page
displayQuestionnaires();
