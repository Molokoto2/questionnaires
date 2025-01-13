let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
let currentQuestionnaire = null;

document.getElementById('start-questionnaire').addEventListener('click', function () {
    const name = prompt('Nom du questionnaire :');
    if (!name) return alert('Veuillez entrer un nom.');

    currentQuestionnaire = { name, questions: [] };
    alert(`Questionnaire "${name}" créé.`);
    document.getElementById('add-question').disabled = false;
    document.getElementById('finalize-questionnaire').disabled = false;
});

document.getElementById('add-question').addEventListener('click', function () {
    if (!currentQuestionnaire) return alert('Créez un questionnaire d\'abord.');
    const questionText = prompt('Texte de la question :');
    const responses = prompt('Réponses possibles (séparées par une virgule) :').split(',');

    currentQuestionnaire.questions.push({ question: questionText, responses });
    alert('Question ajoutée.');
});

document.getElementById('finalize-questionnaire').addEventListener('click', function () {
    if (!currentQuestionnaire || currentQuestionnaire.questions.length === 0) {
        return alert('Ajoutez des questions avant de finaliser.');
    }

    questionnaires.push(currentQuestionnaire);
    localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
    alert(`Questionnaire "${currentQuestionnaire.name}" sauvegardé.`);
    currentQuestionnaire = null;
    document.getElementById('add-question').disabled = true;
    document.getElementById('finalize-questionnaire').disabled = true;
    displayQuestionnaires();
});

function displayQuestionnaires() {
    const list = document.getElementById('list');
    list.innerHTML = '';
    questionnaires.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${q.name}</h3>
            <a href="/repondre.html?name=${encodeURIComponent(q.name)}" target="_blank">Lien pour répondre</a>
            <button class="delete-questionnaire" data-index="${index}">Supprimer</button>
        `;
        list.appendChild(div);
    });

    document.querySelectorAll('.delete-questionnaire').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            questionnaires.splice(index, 1);
            localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
            displayQuestionnaires();
        });
    });
}

displayQuestionnaires();
