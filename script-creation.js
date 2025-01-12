let questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];

document.getElementById('form-creation').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('questionnaire-name').value;
    const question = document.getElementById('question-text').value;
    const responses = document.getElementById('responses-list').value.split(',').map(r => r.trim());

    if (name && question && responses.length > 0) {
        let questionnaire = questionnaires.find(q => q.name === name);
        if (!questionnaire) {
            questionnaire = { name, questions: [] };
            questionnaires.push(questionnaire);
        }
        questionnaire.questions.push({ question, responses });

        localStorage.setItem('questionnaires', JSON.stringify(questionnaires));
        alert('Question ajoutée avec succès !');
        displayQuestionnaires();
    }
});

function displayQuestionnaires() {
    const list = document.getElementById('questionnaires-list');
    list.innerHTML = questionnaires.map(q => `
        <div>
            <h3>${q.name}</h3>
            <p>${q.questions.map(q => q.question).join(', ')}</p>
            <a href="repondre.html?name=${encodeURIComponent(q.name)}">Lien pour répondre</a>
        </div>
    `).join('');
}

displayQuestionnaires();
