// Liste des questionnaires sauvegardés
let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
let currentQuestionnaire = null; // Questionnaire en cours de création

// Fonction pour afficher tous les questionnaires créés
function displayQuestionnaires() {
    const list = document.getElementById('questionnaires-list');
    list.innerHTML = ''; // Effacer la liste existante

    questionnaires.forEach((q) => {
        const link = `${window.location.origin}/repondre.html?name=${encodeURIComponent(q.name)}`;
        const div = document.createElement('div');
        div.classList.add('questionnaire-item');
        div.innerHTML = `
            <h3>${q.name}</h3>
            <p>Questions :</p>
            <ul>
                ${q.questions.map((question) => `<li>${question.question}</li>`).join('')}
            </ul>
            <p><strong>Lien pour répondre :</strong> <a href="${link}" target="_blank">${link}</a></p>
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
