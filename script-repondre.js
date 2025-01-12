document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const questionnaires = JSON.parse(localStorage.getItem('questionnaires')) || [];
    const questionnaire = questionnaires.find(q => q.name === name);

    if (questionnaire) {
        const div = document.getElementById('questionnaire-to-answer');
        div.innerHTML = `
            <h3>${questionnaire.name}</h3>
            ${questionnaire.questions.map(q => `
                <p>${q.question}</p>
                ${q.responses.map(r => `<label><input type="radio" name="${q.question}" value="${r}"> ${r}</label>`).join('<br>')}
            `).join('')}
        `;
    }
});
