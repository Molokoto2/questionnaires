const params = new URLSearchParams(window.location.search);
const questionnaireName = params.get('name');
const questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];

const questionnaire = questionnaires.find(q => q.name === questionnaireName);
if (!questionnaire) {
    document.body.innerHTML = '<h1>Questionnaire introuvable</h1>';
} else {
    document.getElementById('questionnaire-title').innerText = questionnaire.name;

    const form = document.getElementById('questionnaire-form');
    questionnaire.questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${q.question}</h3>
            ${q.responses.map(r => `<label><input type="radio" name="q${index}" value="${r}"> ${r}</label>`).join('<br>')}
        `;
        form.appendChild(div);
    });

    document.getElementById('submit-response').addEventListener('click', function () {
        const formData = new FormData(form);

        const responses = Array.from(formData.entries()).map(([key, value]) => ({
            question: questionnaire.questions[parseInt(key.replace('q', ''))].question,
            response: value,
        }));

        const allResponses = JSON.parse(localStorage.getItem('responses')) || {};
        if (!allResponses[questionnaire.name]) {
            allResponses[questionnaire.name] = [];
        }
        allResponses[questionnaire.name].push(responses);

        localStorage.setItem('responses', JSON.stringify(allResponses));
        alert('Merci pour vos réponses !');
        window.location.href = 'index.html';
    });
}